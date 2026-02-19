import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req: Request) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

    try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (!supabaseUrl || !serviceRoleKey) {
            console.error('Missing env vars:', { supabaseUrl: !!supabaseUrl, serviceRoleKey: !!serviceRoleKey });
            return new Response(JSON.stringify({ error: 'Server configuration error: missing environment variables' }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
            auth: { autoRefreshToken: false, persistSession: false }
        });

        // Verificar o token de autenticação do chamador
        const authHeader = req.headers.get('Authorization');
        console.log('Auth header present:', !!authHeader);

        if (!authHeader) {
            return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
                status: 401,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user: callerUser }, error: callerError } = await supabaseAdmin.auth.getUser(token);

        console.log('Caller user:', callerUser?.id, '| Error:', callerError?.message);

        if (callerError || !callerUser) {
            return new Response(JSON.stringify({ error: 'Unauthorized: invalid token' }), {
                status: 401,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // Verificar se o chamador é admin
        const { data: callerProfile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('role, email')
            .eq('user_id', callerUser.id)
            .single();

        console.log('Caller profile:', JSON.stringify(callerProfile), '| Profile error:', profileError?.message);

        if (profileError) {
            return new Response(JSON.stringify({ error: `Erro ao verificar permissões: ${profileError.message}` }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        if (!callerProfile || callerProfile.role !== 'admin') {
            return new Response(JSON.stringify({
                error: `Forbidden: é necessário ter role 'admin'. Role atual: '${callerProfile?.role || 'nenhum'}'`
            }), {
                status: 403,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // Ler o body do request
        const body = await req.json();
        const { email, password, full_name, role, setor_id } = body;

        console.log('Creating user:', email, '| role:', role);

        if (!email || !password || !full_name || !role) {
            return new Response(JSON.stringify({ error: 'Missing required fields: email, password, full_name, role' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // Usar a API de admin — não dispara "already registered" para fluxos admin
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name, role }
        });

        console.log('Create user result:', newUser?.user?.id, '| Error:', createError?.message);

        if (createError) {
            const status = createError.message?.toLowerCase().includes('already') ? 409 : 400;
            const message = status === 409
                ? 'Este email já está registado no sistema de autenticação'
                : createError.message;
            return new Response(JSON.stringify({ error: message }), {
                status,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // Criar/atualizar perfil
        const { error: upsertError } = await supabaseAdmin
            .from('profiles')
            .upsert({
                user_id: newUser.user.id,
                email,
                full_name,
                role,
                setor_id: setor_id || null,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });

        console.log('Profile upsert error:', upsertError?.message);

        if (upsertError) {
            // Reverter a criação do utilizador auth se o perfil falhar
            await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
            return new Response(JSON.stringify({ error: `Erro ao criar perfil: ${upsertError.message}` }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({
            success: true,
            user_id: newUser.user.id,
            email: newUser.user.email
        }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Connection': 'keep-alive' }
        });

    } catch (err) {
        console.error('Unexpected error:', err);
        return new Response(JSON.stringify({ error: `Internal server error: ${(err as Error).message}` }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
