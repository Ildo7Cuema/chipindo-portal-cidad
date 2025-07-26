import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';

export interface ExportData {
  headers: string[];
  rows: (string | number)[][];
  title?: string;
  subtitle?: string;
  metadata?: {
    [key: string]: string | number;
  };
}

export interface ExportOptions {
  filename?: string;
  sheetName?: string;
  includeTimestamp?: boolean;
  author?: string;
  company?: string;
}

class ExportUtils {
  private static generateFilename(baseName: string, format: string, includeTimestamp: boolean = true): string {
    const timestamp = includeTimestamp ? new Date().toISOString().split('T')[0] : '';
    const suffix = includeTimestamp ? `-${timestamp}` : '';
    return `${baseName}${suffix}.${format}`;
  }

  private static formatDate(): string {
    return new Date().toLocaleString('pt-AO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Export data to CSV format
   */
  static exportToCSV(data: ExportData, options: ExportOptions = {}): void {
    const {
      filename = 'export',
      includeTimestamp = true
    } = options;

    let csvContent = '';

    // Add title and metadata if provided
    if (data.title) {
      csvContent += `${data.title}\n`;
    }
    if (data.subtitle) {
      csvContent += `${data.subtitle}\n`;
    }
    if (data.metadata) {
      Object.entries(data.metadata).forEach(([key, value]) => {
        csvContent += `${key},${value}\n`;
      });
      csvContent += '\n';
    }

    // Add headers
    csvContent += data.headers.join(',') + '\n';

    // Add data rows
    data.rows.forEach(row => {
      const escapedRow = row.map(cell => {
        const cellStr = String(cell);
        // Escape cells containing commas, quotes, or newlines
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      });
      csvContent += escapedRow.join(',') + '\n';
    });

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const finalFilename = this.generateFilename(filename, 'csv', includeTimestamp);
    saveAs(blob, finalFilename);
  }

  /**
   * Export data to Excel format
   */
  static exportToExcel(data: ExportData, options: ExportOptions = {}): void {
    const {
      filename = 'export',
      sheetName = 'Dados',
      includeTimestamp = true,
      author = 'Portal de Chipindo',
      company = 'Município de Chipindo'
    } = options;

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Prepare data for the worksheet
    const worksheetData: any[][] = [];

    // Add title and metadata
    if (data.title) {
      worksheetData.push([data.title]);
      worksheetData.push([]); // Empty row
    }
    if (data.subtitle) {
      worksheetData.push([data.subtitle]);
      worksheetData.push([]); // Empty row
    }
    if (data.metadata) {
      Object.entries(data.metadata).forEach(([key, value]) => {
        worksheetData.push([key, value]);
      });
      worksheetData.push([]); // Empty row
    }

    // Add generation info
    worksheetData.push(['Gerado em:', this.formatDate()]);
    worksheetData.push(['Por:', author]);
    worksheetData.push([]); // Empty row

    // Add headers
    worksheetData.push(data.headers);

    // Add data rows
    data.rows.forEach(row => {
      worksheetData.push(row);
    });

    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set column widths
    const colWidths = data.headers.map(() => ({ wch: 20 }));
    worksheet['!cols'] = colWidths;

    // Style the title (if exists)
    if (data.title) {
      const titleCell = 'A1';
      if (!worksheet[titleCell]) worksheet[titleCell] = {};
      worksheet[titleCell].s = {
        font: { bold: true, sz: 16 },
        alignment: { horizontal: 'center' }
      };
    }

    // Style the headers
    const headerRowIndex = worksheetData.findIndex(row => 
      Array.isArray(row) && row.length === data.headers.length && 
      row.every((cell, index) => cell === data.headers[index])
    );
    
    if (headerRowIndex >= 0) {
      data.headers.forEach((_, colIndex) => {
        const cellAddress = XLSX.utils.encode_cell({ r: headerRowIndex, c: colIndex });
        if (!worksheet[cellAddress]) worksheet[cellAddress] = {};
        worksheet[cellAddress].s = {
          font: { bold: true },
          fill: { fgColor: { rgb: 'E2E8F0' } },
          alignment: { horizontal: 'center' }
        };
      });
    }

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Set workbook properties
    workbook.Props = {
      Title: data.title || 'Relatório',
      Subject: data.subtitle || 'Dados Exportados',
      Author: author,
      Company: company,
      CreatedDate: new Date()
    };

    // Generate and save file
    const finalFilename = this.generateFilename(filename, 'xlsx', includeTimestamp);
    XLSX.writeFile(workbook, finalFilename);
  }

  /**
   * Export data to PDF format
   */
  static exportToPDF(data: ExportData, options: ExportOptions = {}): void {
    const {
      filename = 'export',
      includeTimestamp = true,
      author = 'Portal de Chipindo',
      company = 'Município de Chipindo'
    } = options;

    // Create new PDF document
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    let yPosition = 20;

    // Add header with logo placeholder and title
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    
    if (data.title) {
      pdf.text(data.title, 20, yPosition);
      yPosition += 10;
    }

    if (data.subtitle) {
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'normal');
      pdf.text(data.subtitle, 20, yPosition);
      yPosition += 8;
    }

    // Add metadata
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    if (data.metadata) {
      Object.entries(data.metadata).forEach(([key, value]) => {
        pdf.text(`${key}: ${value}`, 20, yPosition);
        yPosition += 5;
      });
      yPosition += 5;
    }

    // Add generation info
    pdf.text(`Gerado em: ${this.formatDate()}`, 20, yPosition);
    yPosition += 5;
    pdf.text(`Por: ${author}`, 20, yPosition);
    yPosition += 10;

    // Add table using autoTable
    autoTable(pdf, {
      head: [data.headers],
      body: data.rows,
      startY: yPosition,
      theme: 'grid',
      headStyles: {
        fillColor: [226, 232, 240], // Equivalent to bg-slate-200
        textColor: [51, 51, 51],
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        textColor: [51, 51, 51],
        fontSize: 9
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252] // Equivalent to bg-slate-50
      },
      columnStyles: {},
      margin: { top: 20, right: 20, bottom: 20, left: 20 },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        overflow: 'linebreak',
        lineWidth: 0.1,
        lineColor: [200, 200, 200]
      }
    });

    // Add footer
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      
      // Company info in footer
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text(company, 20, pdf.internal.pageSize.height - 10);
      
      // Page numbers
      pdf.text(
        `Página ${i} de ${pageCount}`,
        pdf.internal.pageSize.width - 40,
        pdf.internal.pageSize.height - 10
      );
    }

    // Save the PDF
    const finalFilename = this.generateFilename(filename, 'pdf', includeTimestamp);
    pdf.save(finalFilename);
  }

  /**
   * Export dashboard statistics
   */
  static exportDashboardStats(stats: any): ExportData {
    const publicationRate = stats.totalNews > 0 ? Math.round((stats.publishedNews / stats.totalNews) * 100) : 0;
    const transparencyRate = stats.totalAcervoItems > 0 ? Math.round((stats.publicAcervoItems / stats.totalAcervoItems) * 100) : 0;

    const exportData: ExportData = {
      title: 'Relatório do Dashboard Executivo',
      subtitle: 'Portal Municipal de Chipindo',
      headers: ['Métrica', 'Valor', 'Descrição', 'Observações'],
      rows: [
        ['Total de Notícias', stats.totalNews, `${stats.publishedNews} publicadas`, `${stats.totalNews - stats.publishedNews} em rascunho`],
        ['Concursos', stats.totalConcursos, `${stats.activeConcursos} ativos`, `${stats.totalConcursos - stats.activeConcursos} inativos`],
        ['Direcções', stats.totalDirecoes, 'Áreas de atuação', 'Estrutura organizacional'],
        ['Organigrama', stats.totalOrganigramaMembers, 'Membros ativos', 'Funcionários registrados'],
        ['Acervo Digital', stats.totalAcervoItems, `${stats.publicAcervoItems} públicos`, 'Documentos disponíveis'],
        ['Usuários', stats.totalUsers, 'Total cadastrados', 'Administradores e editores'],
        ['Taxa de Publicação', `${publicationRate}%`, 'Notícias publicadas', publicationRate >= 80 ? 'Excelente' : 'Pode melhorar'],
        ['Taxa de Transparência', `${transparencyRate}%`, 'Documentos públicos', transparencyRate >= 75 ? 'Boa transparência' : 'Aumentar transparência']
      ],
      metadata: {
        'Sistema': 'Portal Municipal',
        'Município': 'Chipindo',
        'Província': 'Huíla',
        'País': 'Angola'
      }
    };

    return exportData;
  }

  /**
   * Export activities data
   */
  static exportActivities(activities: any[]): ExportData {
    return {
      title: 'Relatório de Atividades do Sistema',
      subtitle: 'Portal Municipal de Chipindo',
      headers: ['Tipo', 'Título', 'Descrição', 'Status', 'Data de Criação', 'Autor'],
      rows: activities.map(activity => [
        activity.type,
        activity.title,
        activity.description,
        activity.status || 'N/A',
        new Date(activity.created_at).toLocaleString('pt-AO'),
        activity.author || 'Sistema'
      ]),
      metadata: {
        'Total de Atividades': activities.length,
        'Período': 'Últimas atualizações',
        'Sistema': 'Portal Municipal'
      }
    };
  }
}

export default ExportUtils; 