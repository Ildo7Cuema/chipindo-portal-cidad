export const sectorKeywords: Record<string, string[]> = {
    'educação': ['escola', 'escolar', 'académico', 'professor', 'aluno', 'educacional', 'sala de aula', 'parque infantil', 'educação'],
    'saúde': ['hospital', 'médico', 'enfermeiro', 'clínica', 'atendimento médico', 'sanitário', 'saúde pública', 'saúde'],
    'agricultura': ['agricultura', 'agricultor', 'fazenda', 'colheita', 'campo', 'rural', 'apoio técnico'],
    'setor mineiro': ['mina', 'mineiro', 'mineração', 'mineral', 'extrativo', 'segurança na mina'],
    'desenvolvimento económico': ['desenvolvimento económico', 'emprego', 'economia', 'negócio', 'comercial', 'oportunidades'],
    'cultura': ['cultura', 'cultural', 'arte', 'evento cultural', 'teatro', 'artístico', 'arte local'],
    'tecnologia': ['tecnologia', 'tecnológico', 'sistema', 'digital', 'computador', 'informática', 'modernizar sistemas'],
    'energia e água': ['energia', 'água', 'eletricidade', 'abastecimento de água', 'saneamento', 'iluminação pública']
};

/**
 * Normaliza uma string para comparação: remove acentos, converte para lowercase e faz trim.
 * Usa NFD para decompor caracteres acentuados e remove os diacríticos.
 */
export const normalizeForComparison = (text: string): string => {
    return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // remove diacríticos
        .toLowerCase()
        .trim();
};

/**
 * Verifica se alguma das áreas de interesse do registo corresponde directamente ao nome do setor
 * do utilizador. Usa normalização Unicode para lidar com diferenças de acentuação.
 *
 * @param areasOfInterest Array de áreas de interesse do registo
 * @param sectorName Nome do setor do utilizador (pode ter acentos ou não)
 * @returns boolean True se houver correspondência directa
 */
export const matchesSectorArea = (areasOfInterest: string[], sectorName: string): boolean => {
    if (!sectorName) return true; // sem setor = admin, ver tudo
    if (!areasOfInterest || areasOfInterest.length === 0) return false;

    const normalizedSector = normalizeForComparison(sectorName);

    return areasOfInterest.some(area => {
        if (!area) return false;
        const normalizedArea = normalizeForComparison(area);
        // Correspondência directa ou o nome do setor contido na área (ex: "Sector Mineiro" ↔ "Setor Mineiro")
        return normalizedArea === normalizedSector || normalizedArea.includes(normalizedSector) || normalizedSector.includes(normalizedArea);
    });
};

/**
 * Checks if any of the provided texts match the keywords for the given sector name.
 * 
 * @param texts An array of strings to check against sector keywords
 * @param sectorName The name of the sector to get keywords for
 * @returns boolean True if there's a match, false otherwise
 */
export const matchesSectorKeywords = (texts: string[], sectorName: string): boolean => {
    if (!sectorName) return true; // If no sector name, show everything (admin behavior)

    const normalizedSectorName = sectorName.toLowerCase();
    const keywords = sectorKeywords[normalizedSectorName] || [normalizedSectorName];

    return texts.some(text => {
        if (!text) return false;
        const normalizedText = text.toLowerCase();
        return keywords.some(keyword => normalizedText.includes(keyword.toLowerCase()));
    });
};
