import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Search, MapPin, Smartphone, Monitor, Globe } from "lucide-react";

interface SiteVisit {
    id: string;
    page_path: string;
    created_at: string;
    ip_address?: string;
    city?: string;
    region?: string;
    country?: string;
    device_type?: string;
    browser?: string;
    os?: string;
    user_agent?: string;
}

export function SiteVisitsReport() {
    const [visits, setVisits] = useState<SiteVisit[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchVisits = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("site_visits")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(100);

            if (error) throw error;
            setVisits(data || []);
        } catch (error) {
            console.error("Erro ao buscar visitas:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVisits();
    }, []);

    const filteredVisits = visits.filter((visit) =>
        visit.page_path.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visit.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visit.country?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getDeviceIcon = (type?: string) => {
        switch (type) {
            case "mobile":
                return <Smartphone className="w-4 h-4 text-blue-500" />;
            case "tablet":
                return <Smartphone className="w-4 h-4 text-purple-500" />;
            default:
                return <Monitor className="w-4 h-4 text-gray-500" />;
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Relatório de Acessos Detalhado</span>
                    <Badge variant="outline" className="ml-2">
                        Últimos 100 acessos
                    </Badge>
                </CardTitle>
                <CardDescription>
                    Visualize quem está acessando o portal, de onde e quando.
                </CardDescription>
                <div className="relative mt-2">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Filtrar por página, cidade ou país..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Data/Hora</TableHead>
                                <TableHead>Página</TableHead>
                                <TableHead>Localização</TableHead>
                                <TableHead>Dispositivo</TableHead>
                                <TableHead>Navegador/OS</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">
                                        Carregando dados...
                                    </TableCell>
                                </TableRow>
                            ) : filteredVisits.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        Nenhum registro encontrado.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredVisits.map((visit) => (
                                    <TableRow key={visit.id}>
                                        <TableCell className="whitespace-nowrap">
                                            {format(new Date(visit.created_at), "dd/MM/yyyy HH:mm", {
                                                locale: ptBR,
                                            })}
                                        </TableCell>
                                        <TableCell className="font-medium text-blue-600">
                                            {visit.page_path}
                                        </TableCell>
                                        <TableCell>
                                            {visit.city || visit.country ? (
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-3 h-3 text-red-500" />
                                                    <span>
                                                        {visit.city ? `${visit.city}, ` : ""}
                                                        {visit.country || "Desconhecido"}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground text-xs italic">
                                                    Não detectado
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2" title={visit.user_agent || ""}>
                                                {getDeviceIcon(visit.device_type)}
                                                <span className="capitalize">
                                                    {visit.device_type || "Desktop"}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-xs">
                                                <span className="font-medium">{visit.browser || "Unknown Browser"}</span>
                                                <span className="text-muted-foreground">{visit.os || "Unknown OS"}</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
