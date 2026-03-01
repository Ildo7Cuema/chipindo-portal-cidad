import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Image as ImageIcon, BriefcaseMedical } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../../hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface HospitalInfrastructure {
    id: string;
    name: string;
    type: 'hospital_municipal' | 'centro_saude' | 'posto_saude';
    description: string;
    location: string;
    coordinates: string | null;
    phone: string | null;
    email: string | null;
    operating_hours: string;
    capacity_beds: number;
    is_active: boolean;
}

interface HospitalService {
    id: string;
    infrastructure_id: string;
    name: string;
    description: string;
    availability: string;
}

interface HospitalImage {
    id: string;
    infrastructure_id: string;
    url: string;
    section: string;
    caption: string;
    featured: boolean;
}

export function HospitalInfrastructureManager() {
    const [infrastructures, setInfrastructures] = useState<HospitalInfrastructure[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState<Partial<HospitalInfrastructure>>({});

    // States for Modals
    const [managingServicesObj, setManagingServicesObj] = useState<HospitalInfrastructure | null>(null);
    const [managingImagesObj, setManagingImagesObj] = useState<HospitalInfrastructure | null>(null);

    // States for internal modal views
    const [services, setServices] = useState<HospitalService[]>([]);
    const [images, setImages] = useState<HospitalImage[]>([]);

    useEffect(() => {
        fetchInfrastructures()
    }, []);

    async function fetchInfrastructures() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('hospital_infrastructures')
                .select('*')
                .order('name' );

            if (error) throw error;
            setInfrastructures(data || []);
        } catch (error) {
            console.error('Error fetching infrastructures:', error );
            toast({ variant: "destructive", description: 'Erro ao carregar infraestruturas.'  });
        } finally {
            setLoading(false);
        }
    }

    async function fetchServices(infrastructureId: string) {
        try {
            const { data, error } = await supabase
                .from('hospital_services')
                .select('*')
                .eq('infrastructure_id', infrastructureId)
                .order('name' );

            if (error) throw error;
            setServices(data || []);
        } catch (error) {
            console.error('Error fetching services:', error );
            toast({ variant: "destructive", description: 'Erro ao carregar serviços.'  });
        }
    }

    async function fetchImages(infrastructureId: string) {
        try {
            const { data, error } = await supabase
                .from('hospital_images')
                .select('*')
                .eq('infrastructure_id', infrastructureId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setImages(data || []);
        } catch (error) {
            console.error('Error fetching images:', error );
            toast({ variant: "destructive", description: 'Erro ao carregar imagens.'  });
        }
    }

    const handleSave = async (id: string | null) => {
        try {
            if (id) {
                // Update existing
                const { error } = await supabase
                    .from('hospital_infrastructures')
                    .update({
                        name: formData.name,
                        type: formData.type,
                        description: formData.description,
                        location: formData.location,
                        phone: formData.phone,
                        email: formData.email,
                        operating_hours: formData.operating_hours,
                        capacity_beds: formData.capacity_beds,
                        is_active: formData.is_active
                    })
                    .eq('id', id );

                if (error) throw error;
                toast({ description: 'Infraestrutura atualizada com sucesso!'  });
            } else {
                // Create new
                const { error } = await supabase
                    .from('hospital_infrastructures')
                    .insert([{
                        name: formData.name,
                        type: formData.type || 'posto_saude',
                        description: formData.description,
                        location: formData.location,
                        phone: formData.phone,
                        email: formData.email,
                        operating_hours: formData.operating_hours,
                        capacity_beds: formData.capacity_beds || 0,
                        is_active: formData.is_active ?? true
                    }] );

                if (error) throw error;
                toast({ description: 'Infraestrutura criada com sucesso!'  });
            }

            setEditingId(null);
            setIsCreating(false);
            setFormData({});
            fetchInfrastructures()
        } catch (error) {
            console.error('Error saving infrastructure:', error );
            toast({ variant: "destructive", description: 'Erro ao guardar infraestrutura.'  });
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Tem certeza que deseja remover esta infraestrutura? Todos os serviços e imagens associados serão perdidos.')) return;

        try {
            const { error } = await supabase
                .from('hospital_infrastructures')
                .delete()
                .eq('id', id );

            if (error) throw error;
            toast({ description: 'Infraestrutura removida com sucesso!'  });
            fetchInfrastructures()
        } catch (error) {
            console.error('Error deleting infrastructure:', error );
            toast({ variant: "destructive", description: 'Erro ao remover infraestrutura.'  });
        }
    };

    const handleImageUpload = async (file: File) => {
        if (!managingImagesObj) return;

        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${managingImagesObj.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('hospital_images')
                .upload(filePath, file );

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('hospital_images')
                .getPublicUrl(filePath );

            const section = prompt('Introduza a secção/área desta imagem (ex: Recepção, Urgências, Exterior):', 'Geral' );
            if (!section) return; // cancelled

            const { error: dbError } = await supabase
                .from('hospital_images')
                .insert([{
                    infrastructure_id: managingImagesObj.id,
                    url: publicUrl,
                    section: section,
                    caption: '',
                    featured: images.length === 0
                }] );

            if (dbError) throw dbError;

            toast({ description: 'Imagem carregada com sucesso!'  });
            fetchImages(managingImagesObj.id );

        } catch (error) {
            console.error('Error uploading image:', error );
            toast({ variant: "destructive", description: 'Erro ao fazer upload da imagem.'  });
        }
    };

    const handleServiceSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!managingServicesObj) return;

        const form = e.currentTarget;
        const formDataObj = new FormData(form );

        try {
            const { error } = await supabase
                .from('hospital_services')
                .insert([{
                    infrastructure_id: managingServicesObj.id,
                    name: formDataObj.get('name') as string,
                    description: formDataObj.get('description') as string,
                    availability: formDataObj.get('availability') as string,
                }] );

            if (error) throw error;
            toast({ description: 'Serviço adicionado com sucesso!'  });
            form.reset()
            fetchServices(managingServicesObj.id );
        } catch (error) {
            console.error('Error adding service:', error );
            toast({ variant: "destructive", description: 'Erro ao adicionar serviço.'  });
        }
    };

    const handleDeleteService = async (serviceId: string) => {
        try {
            const { error } = await supabase
                .from('hospital_services')
                .delete()
                .eq('id', serviceId );

            if (error) throw error;
            toast({ description: 'Serviço removido com sucesso!'  });
            if (managingServicesObj) fetchServices(managingServicesObj.id );
        } catch (error) {
            console.error('Error removing service:', error );
            toast({ variant: "destructive", description: 'Erro ao remover serviço.'  });
        }
    };

    const handleDeleteImage = async (imageId: string) => {
        try {
            const { error } = await supabase
                .from('hospital_images')
                .delete()
                .eq('id', imageId );

            if (error) throw error;
            toast({ description: 'Imagem removida com sucesso!'  });
            if (managingImagesObj) fetchImages(managingImagesObj.id );
        } catch (error) {
            console.error('Error removing image:', error );
            toast({ variant: "destructive", description: 'Erro ao remover imagem.'  });
        }
    }

    const handleSetFeaturedImage = async (imageId: string) => {
        try {
            if (!managingImagesObj) return;

            // first set all to false
            await supabase
                .from('hospital_images')
                .update({ featured: false })
                .eq('infrastructure_id', managingImagesObj.id );

            const { error } = await supabase
                .from('hospital_images')
                .update({ featured: true })
                .eq('id', imageId );

            if (error) throw error;
            toast({ description: 'Imagem principal definida com sucesso!'  });
            fetchImages(managingImagesObj.id );
        } catch (error) {
            console.error('Error updating image feature:', error );
            toast({ variant: "destructive", description: 'Erro ao definir imagem principal.'  });
        }
    }

    if (loading) {
        return <div className="p-8 text-center">Carregando infraestruturas da Saúde...</div>;
    }

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'hospital_municipal': return 'Hospital Municipal';
            case 'centro_saude': return 'Centro de Saúde';
            case 'posto_saude': return 'Posto de Saúde';
            default: return type;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold dark:text-gray-100">Gestão de Infraestruturas de Saúde</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Adicione e modifique os centros de saúde, hospitais, respetivos serviços e relatórios fotográficos.
                    </p>
                </div>
                {!isCreating && (
                    <button
                        onClick={() => {
                            setIsCreating(true);
                            setFormData({ type: 'posto_saude', is_active: true, capacity_beds: 0 });
                        }}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                        <Plus size={18} />
                        Nova Unidade
                    </button>
                )}
            </div>

            {(isCreating || editingId) && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium mb-4">{isCreating ? 'Nova Unidade de Saúde' : 'Editar Unidade de Saúde'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-200">Nome</label>
                            <input
                                type="text"
                                value={formData.name || ''}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-200">Tipo da Unidade</label>
                            <select
                                value={formData.type || 'posto_saude'}
                                onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <option value="hospital_municipal">Hospital Municipal</option>
                                <option value="centro_saude">Centro de Saúde</option>
                                <option value="posto_saude">Posto de Saúde</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1 dark:text-gray-200">Descrição</label>
                            <textarea
                                value={formData.description || ''}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                rows={3}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-200">Localização Cívica/Endereço</label>
                            <input
                                type="text"
                                value={formData.location || ''}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-200">Horário de Funcionamento</label>
                            <input
                                type="text"
                                value={formData.operating_hours || ''}
                                onChange={e => setFormData({ ...formData, operating_hours: e.target.value })}
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Ex: 24h, Seg-Sex 8h-15h30"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-200">Telefone</label>
                            <input
                                type="text"
                                value={formData.phone || ''}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-200">Capacidade de Camas</label>
                            <input
                                type="number"
                                value={formData.capacity_beds || 0}
                                onChange={e => setFormData({ ...formData, capacity_beds: parseInt(e.target.value) || 0 })}
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                        <div className="flex items-center mt-6">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={formData.is_active !== false}
                                onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                                className="mr-2 h-4 w-4"
                            />
                            <label htmlFor="is_active" className="text-sm dark:text-gray-200">
                                Unidade Ativa
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            onClick={() => {
                                setIsCreating(false);
                                setEditingId(null);
                                setFormData({});
                            }}
                            className="px-4 py-2 text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={() => handleSave(editingId)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            <Save size={18} />
                            Guardar
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Unidade</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Localização</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {infrastructures.map(infra => (
                            <tr key={infra.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{infra.name}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">{getTypeLabel(infra.type)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {infra.location}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${infra.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {infra.is_active ? 'Ativo' : 'Inativo'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            title="Gerir Serviços Clínicos/Gerais"
                                            onClick={() => { setManagingServicesObj(infra ); fetchServices(infra.id); }}
                                            className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 p-1"
                                        >
                                            <BriefcaseMedical size={18} />
                                        </button>
                                        <button
                                            title="Gerir Relatório Fotográfico"
                                            onClick={() => { setManagingImagesObj(infra ); fetchImages(infra.id ); }}
                                            className="text-indigo-600 hover:text-indigo-900 dark:hover:text-indigo-400 p-1"
                                        >
                                            <ImageIcon size={18} />
                                        </button>
                                        <button
                                            title="Editar Infraestrutura"
                                            onClick={() => {
                                                setEditingId(infra.id);
                                                setFormData(infra);
                                                setIsCreating(false);
                                            }}
                                            className="text-gray-600 hover:text-gray-900 dark:hover:text-gray-400 p-1"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            title="Apagar Infraestrutura"
                                            onClick={() => handleDelete(infra.id)}
                                            className="text-red-600 hover:text-red-900 dark:hover:text-red-400 p-1"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {infrastructures.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                                    Nenhuma infraestrutura registada.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Services Modal */}
            {managingServicesObj && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
                            <h3 className="text-xl font-bold dark:text-white">Serviços: {managingServicesObj.name}</h3>
                            <button onClick={() => setManagingServicesObj(null)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1 flex gap-8">
                            <div className="w-1/3">
                                <h4 className="font-semibold mb-4 dark:text-gray-200">Novo Serviço</h4>
                                <form onSubmit={handleServiceSave} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1 dark:text-gray-400">Nome</label>
                                        <input name="name" required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Ex: Urgências Gerais" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 dark:text-gray-400">Descrição</label>
                                        <textarea name="description" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" rows={3} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 dark:text-gray-400">Disponibilidade</label>
                                        <input name="availability" required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Ex: Seg a Sex, 8-16h ou 24h" />
                                    </div>
                                    <button type="submit" className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                                        <Plus size={18} /> Adicionar Serviço
                                    </button>
                                </form>
                            </div>
                            <div className="w-2/3">
                                <h4 className="font-semibold mb-4 dark:text-gray-200">Serviços Existentes</h4>
                                <div className="space-y-3">
                                    {services.map(s => (
                                        <div key={s.id} className="p-4 border dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-900 flex justify-between items-start gap-4">
                                            <div>
                                                <h5 className="font-medium dark:text-white">{s.name}</h5>
                                                <p className="text-sm text-gray-500 mt-1">{s.description}</p>
                                                <span className="inline-block mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                    {s.availability}
                                                </span>
                                            </div>
                                            <button onClick={() => handleDeleteService(s.id)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                    {services.length === 0 && (
                                        <p className="text-sm text-gray-500">Nenhum serviço registado nesta unidade.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Images Modal */}
            {managingImagesObj && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
                            <div>
                                <h3 className="text-xl font-bold dark:text-white">Imagens da Unidade de Saúde</h3>
                                <p className="text-sm text-gray-500">{managingImagesObj.name}</p>
                            </div>
                            <button onClick={() => setManagingImagesObj(null)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1">
                            <div className="mb-6 p-4 border dark:border-gray-700 border-dashed rounded-lg bg-gray-50 dark:bg-gray-900 text-center">
                                <input
                                    type="file"
                                    id="image-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            handleImageUpload(e.target.files[0] );
                                        }
                                    }}
                                />
                                <label htmlFor="image-upload" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
                                    <ImageIcon size={20} />
                                    Carregar Nova Imagem
                                </label>
                                <p className="mt-2 text-xs text-gray-500">Formatos suportados: JPG, PNG, WEBP.</p>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                {images.map(img => (
                                    <div key={img.id} className="border dark:border-gray-700 rounded-lg overflow-hidden relative group">
                                        <img src={img.url} className="w-full h-48 object-cover" alt={img.section} />
                                        <div className="p-3 bg-white dark:bg-gray-800 flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold text-sm dark:text-gray-200">{img.section}</p>
                                                {img.featured && <span className="text-xs text-indigo-600 font-medium">Imagem Principal</span>}
                                            </div>
                                        </div>
                                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {!img.featured && (
                                                <button onClick={() => handleSetFeaturedImage(img.id)} className="bg-white/90 text-indigo-600 p-1.5 rounded hover:bg-indigo-50 shadow" title="Definir como principal">
                                                    <ImageIcon size={16} />
                                                </button>
                                            )}
                                            <button onClick={() => handleDeleteImage(img.id)} className="bg-white/90 text-red-600 p-1.5 rounded hover:bg-red-50 shadow" title="Apagar imagem">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {images.length === 0 && (
                                    <div className="col-span-full py-8 text-center text-gray-500">
                                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-2 opacity-20" />
                                        <p>Nenhuma imagem disponível.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
     );
} 
