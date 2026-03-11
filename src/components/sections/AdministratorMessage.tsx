import { Section, SectionContent } from "@/components/ui/section";
import { Card, CardContent } from "@/components/ui/card";
import { QuoteIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import administradorImg from "@/assets/Ângelo Singue_Imagem Institucional.jpeg";

export const AdministratorMessage = () => {
    return (
        <Section variant="default" size="lg" className="relative">
            {/* Decorative background */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-orange-500/5" />
            <div className="absolute top-0 left-0 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

            <SectionContent className="relative z-10">
                <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-card via-card to-card/95">
                    {/* Top accent bar */}
                    <div className="h-1.5 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600 w-full" />

                    <CardContent className="p-0">
                        <div className="flex flex-col lg:flex-row">
                            {/* Administrator Photo - Left */}
                            <div className="lg:w-2/5 relative group lg:self-start">
                                <div className="relative overflow-hidden">
                                    <img
                                        src={administradorImg}
                                        alt="Ângelo Singue - Administrador Municipal de Chipindo"
                                        className="w-full h-auto block transition-transform duration-700 group-hover:scale-105"
                                    />
                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                    {/* Name overlay at bottom of image */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                                        <div className="space-y-2">
                                            <div className="inline-flex items-center gap-2 bg-yellow-500/20 backdrop-blur-md border border-yellow-500/30 rounded-full px-4 py-1.5">
                                                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                                                <span className="text-yellow-200 text-xs font-semibold tracking-wider uppercase">
                                                    Administração Municipal
                                                </span>
                                            </div>
                                            <h3 className="text-2xl md:text-3xl font-bold text-white">
                                                Ângelo Singue
                                            </h3>
                                            <p className="text-white/80 text-sm md:text-base font-medium">
                                                Administrador Municipal de Chipindo
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Message Content - Right */}
                            <div className="lg:w-3/5 p-6 md:p-8 lg:p-10 flex flex-col justify-start">
                                {/* Section header */}
                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl">
                                            <QuoteIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                                        </div>
                                        <div>
                                            <p className="text-primary font-semibold tracking-wide uppercase text-xs">
                                                Mensagem aos munícipes
                                            </p>
                                            <h2 className="text-xl md:text-2xl font-bold text-foreground">
                                                Palavra do{" "}
                                                <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600 bg-clip-text text-transparent">
                                                    Administrador
                                                </span>
                                            </h2>
                                        </div>
                                    </div>
                                </div>

                                {/* Message text */}
                                <div className="space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
                                    <p>
                                        É com elevado sentido de responsabilidade institucional e profundo compromisso com o desenvolvimento local que dirijo esta mensagem a todos os munícipes de Chipindo, homens, mulheres e jovens que, com dedicação e espírito de trabalho, contribuem diariamente para o progresso da nossa terra. Chipindo é um município de história, de cultura e de gente resiliente, cuja força colectiva tem permitido enfrentar desafios e transformar oportunidades em caminhos concretos de desenvolvimento.
                                    </p>

                                    <p>
                                        A Administração Municipal de Chipindo tem vindo a trabalhar de forma contínua para melhorar as condições de vida da população, apostar na promoção da educação, da saúde, da agricultura, da energia e água, da juventude, do empreendedorismo e na melhoria progressiva das infraestruturas sociais e económicas. Estes esforços reflectem o compromisso permanente de servir o cidadão com responsabilidade, transparência e proximidade, fortalecendo a governação local e de forma a incentivar a participação activa da comunidade no processo de desenvolvimento do município.
                                    </p>

                                    <p>
                                        Importa igualmente realçar o papel estratégico do Governo Provincial da Huíla,{" "}
                                        cuja visão de governação tem impulsionado importantes programas e projectos estruturantes para o progresso da província e, em particular, para o crescimento do município de Chipindo. As acções voltadas para o reforço das infraestruturas, dinamização da economia local, apoio à agricultura familiar e promoção da inclusão social constituem sinais claros do compromisso do Governo Provincial com o bem-estar das populações.
                                    </p>

                                    <p>
                                        Reiteramos, por isso, o nosso compromisso de continuar a trabalhar com dedicação, responsabilidade e espírito de serviço público, reforçar a cooperação entre as instituições do Estado, as organizações sociais, as autoridades tradicionais e toda a comunidade. Juntos, continuaremos a construir um município cada vez mais organizado, próspero e inclusivo.
                                    </p>

                                    <p className="italic text-muted-foreground/80">
                                        Que o espírito de união, trabalho e esperança continue a guiar os destinos do nosso município.
                                    </p>
                                </div>

                                {/* Signature */}
                                <div className="mt-8 pt-6 border-t border-border/50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full" />
                                        <div>
                                            <p className="font-bold text-foreground text-lg">Ângelo Singue</p>
                                            <p className="text-sm text-muted-foreground italic">
                                                Administrador Municipal de Chipindo
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </SectionContent>
        </Section>
    );
};
