import { jsPDF } from "jspdf";
import { Service } from "../types";

// Cache for loaded base64 fonts to avoid repeating network requests
let regularFontBase64: string | null = null;
let boldFontBase64: string | null = null;

const ROBOTO_REGULAR_URL = "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/roboto/static/Roboto-Regular.ttf";
const ROBOTO_BOLD_URL = "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/roboto/static/Roboto-Bold.ttf";

/**
 * Fetch a TTF font from a URL and convert it to Base64
 */
async function fetchFontAsBase64(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch font from ${url}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  
  // Efficient conversion from ArrayBuffer to Base64
  const bytes = new Uint8Array(arrayBuffer);
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

interface GeneratePdfOptions {
  service: Service;
  userName?: string;
  checkedItemIds?: string[]; // IDs or indices of items already completed
  customChecklist?: { id: string; text: string; done: boolean }[];
  onProgress?: (loading: boolean) => void;
}

export async function downloadChecklistPdf({
  service,
  userName = "Уважаемый клиент",
  checkedItemIds = [],
  customChecklist,
  onProgress
}: GeneratePdfOptions) {
  if (onProgress) onProgress(true);

  try {
    // 1. Load fonts if not cached
    if (!regularFontBase64) {
      try {
        regularFontBase64 = await fetchFontAsBase64(ROBOTO_REGULAR_URL);
      } catch (err) {
        console.error("Could not load regular font:", err);
      }
    }
    if (!boldFontBase64) {
      try {
        boldFontBase64 = await fetchFontAsBase64(ROBOTO_BOLD_URL);
      } catch (err) {
        console.error("Could not load bold font:", err);
      }
    }

    // 2. Create jsPDF instance
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const hasFonts = regularFontBase64 && boldFontBase64;

    if (hasFonts) {
      // Register Regular
      doc.addFileToVFS("Roboto-Regular.ttf", regularFontBase64!);
      doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
      
      // Register Bold
      doc.addFileToVFS("Roboto-Bold.ttf", boldFontBase64!);
      doc.addFont("Roboto-Bold.ttf", "Roboto", "bold");
      
      doc.setFont("Roboto", "normal");
    } else {
      // Fallback
      doc.setFont("helvetica", "normal");
    }

    // Page settings
    const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2); // 180mm
    let currentY = 15;

    // --- Elegant Header ---
    // Top border line
    doc.setDrawColor(13, 98, 109); // Siam Teal color #0D626D
    doc.setLineWidth(1.5);
    doc.line(margin, currentY, margin + contentWidth, currentY);
    currentY += 6;

    // Brand Name & Subtitle
    doc.setTextColor(13, 98, 109);
    doc.setFontSize(18);
    doc.setFont(hasFonts ? "Roboto" : "helvetica", "bold");
    doc.text("SIAM ASSIST", margin, currentY);
    
    // License/Subtle info
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.setFont(hasFonts ? "Roboto" : "helvetica", "normal");
    doc.text("BANGKOK • PHUKET • CHIANG MAI", margin + contentWidth, currentY, { align: "right" });
    currentY += 5;

    doc.setTextColor(120, 120, 120);
    doc.setFontSize(9);
    doc.text("Персональный визовый сервис и юридическое сопровождение в Таиланде", margin, currentY);
    currentY += 8;

    // Horizontal thin divider
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.3);
    doc.line(margin, currentY, margin + contentWidth, currentY);
    currentY += 8;

    // --- Document Title ---
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(14);
    doc.setFont(hasFonts ? "Roboto" : "helvetica", "bold");
    doc.text("Чек-лист необходимых документов", margin, currentY);
    currentY += 6;

    // Service Title Badge / Box
    doc.setFillColor(243, 240, 233); // #F3F0E9 Siam Sand
    doc.roundedRect(margin, currentY, contentWidth, 14, 2, 2, "F");
    
    doc.setTextColor(13, 98, 109);
    doc.setFontSize(11);
    doc.setFont(hasFonts ? "Roboto" : "helvetica", "bold");
    doc.text(service.title, margin + 4, currentY + 9);
    currentY += 19;

    // --- Metadata Block (Two Columns) ---
    doc.setFillColor(252, 252, 252);
    doc.setDrawColor(240, 240, 240);
    doc.setLineWidth(0.2);
    doc.roundedRect(margin, currentY, contentWidth, 24, 2, 2, "FD");

    doc.setTextColor(120, 120, 120);
    doc.setFontSize(8.5);
    doc.setFont(hasFonts ? "Roboto" : "helvetica", "normal");
    
    // Col 1
    doc.text(`Заявитель:`, margin + 5, currentY + 6);
    doc.setTextColor(40, 40, 40);
    doc.setFont(hasFonts ? "Roboto" : "helvetica", "bold");
    doc.text(userName, margin + 5, currentY + 11);

    doc.setTextColor(120, 120, 120);
    doc.setFont(hasFonts ? "Roboto" : "helvetica", "normal");
    doc.text(`Срок оформления:`, margin + 5, currentY + 18);
    doc.setTextColor(40, 40, 40);
    doc.setFont(hasFonts ? "Roboto" : "helvetica", "bold");
    doc.text(service.duration, margin + 5, currentY + 23);

    // Col 2
    doc.setTextColor(120, 120, 120);
    doc.setFont(hasFonts ? "Roboto" : "helvetica", "normal");
    doc.text(`Дата генерации:`, margin + 100, currentY + 6);
    doc.setTextColor(40, 40, 40);
    doc.setFont(hasFonts ? "Roboto" : "helvetica", "bold");
    doc.text(new Date().toLocaleDateString("ru-RU"), margin + 100, currentY + 11);

    doc.setTextColor(120, 120, 120);
    doc.setFont(hasFonts ? "Roboto" : "helvetica", "normal");
    doc.text(`Стоимость услуг:`, margin + 100, currentY + 18);
    doc.setTextColor(13, 98, 109);
    doc.setFont(hasFonts ? "Roboto" : "helvetica", "bold");
    doc.text(service.costRange, margin + 100, currentY + 23);

    currentY += 32;

    // --- Description text ---
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(9);
    doc.setFont(hasFonts ? "Roboto" : "helvetica", "normal");
    
    const splitDescription = doc.splitTextToSize(service.description, contentWidth);
    doc.text(splitDescription, margin, currentY);
    currentY += (splitDescription.length * 4.5) + 6;

    // --- Checklist Items Table ---
    doc.setTextColor(13, 98, 109);
    doc.setFontSize(11);
    doc.setFont(hasFonts ? "Roboto" : "helvetica", "bold");
    doc.text("Список документов для подготовки", margin, currentY);
    currentY += 6;

    // Determine which checklist list to draw:
    // If we have custom cabinet checklist, draw it. Otherwise draw the standard service.checklists.
    const itemsToDraw: { text: string; completed: boolean }[] = [];
    if (customChecklist && customChecklist.length > 0) {
      customChecklist.forEach(item => {
        itemsToDraw.push({ text: item.text, completed: item.done });
      });
    } else {
      service.checklists.forEach((item, index) => {
        itemsToDraw.push({ text: item, completed: checkedItemIds.includes(index.toString()) });
      });
    }

    // Draw the list
    itemsToDraw.forEach((item) => {
      // Prevent overflowing bottom of page
      if (currentY > 260) {
        doc.addPage();
        currentY = 20;
        
        // Add minimal header on second page
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.setFont(hasFonts ? "Roboto" : "helvetica", "normal");
        doc.text(`Чек-лист документов: ${service.title} (Продолжение)`, margin, currentY);
        doc.line(margin, currentY + 2, margin + contentWidth, currentY + 2);
        currentY += 8;
      }

      // Checkbox container
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.3);
      if (item.completed) {
        // Filled green/teal square for completed item
        doc.setFillColor(13, 98, 109);
        doc.roundedRect(margin, currentY - 3.5, 4.5, 4.5, 0.8, 0.8, "FD");
        
        // Custom checkmark inside checkbox
        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(0.4);
        doc.line(margin + 1, currentY - 1.5, margin + 2, currentY - 0.5);
        doc.line(margin + 2, currentY - 0.5, margin + 3.8, currentY - 3);
      } else {
        // Empty checkbox
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(margin, currentY - 3.5, 4.5, 4.5, 0.8, 0.8, "D");
      }

      // Text label (supports multiline text wrapping inside cell bounds)
      doc.setFontSize(9.5);
      doc.setTextColor(50, 50, 50);
      doc.setFont(hasFonts ? "Roboto" : "helvetica", item.completed ? "normal" : "normal");
      
      const textX = margin + 8;
      const textWidth = contentWidth - 10;
      const splitText = doc.splitTextToSize(item.text, textWidth);
      
      splitText.forEach((line: string, lineIdx: number) => {
        doc.text(line, textX, currentY + (lineIdx * 4.5) - 0.3);
      });

      currentY += (splitText.length * 4.5) + 4.5;
    });

    // --- Service details block ---
    if (service.fullDetails && service.fullDetails.length > 0) {
      if (currentY > 230) {
        doc.addPage();
        currentY = 20;
      } else {
        currentY += 4;
      }

      doc.setTextColor(13, 98, 109);
      doc.setFontSize(11);
      doc.setFont(hasFonts ? "Roboto" : "helvetica", "bold");
      doc.text("Ключевые детали и условия визы", margin, currentY);
      currentY += 6;

      doc.setFillColor(249, 249, 249);
      doc.setDrawColor(235, 235, 235);
      doc.setLineWidth(0.2);
      
      // We will estimate height based on fullDetails length
      const detailsBoxHeight = (service.fullDetails.length * 7.5) + 4;
      doc.roundedRect(margin, currentY, contentWidth, detailsBoxHeight, 2, 2, "FD");

      doc.setTextColor(80, 80, 80);
      doc.setFontSize(8.5);
      doc.setFont(hasFonts ? "Roboto" : "helvetica", "normal");

      service.fullDetails.forEach((detail, index) => {
        const dY = currentY + (index * 7.5) + 6;
        
        // Bullet point dot
        doc.setFillColor(13, 98, 109);
        doc.circle(margin + 5, dY - 1, 0.8, "F");

        // Text
        const textLimitWidth = contentWidth - 14;
        const splitDetail = doc.splitTextToSize(detail, textLimitWidth);
        doc.text(splitDetail, margin + 9, dY);
      });

      currentY += detailsBoxHeight + 10;
    }

    // --- Footer Banner (Legal Trust and contact info) ---
    if (currentY > 245) {
      doc.addPage();
      currentY = 20;
    }

    // Border line at the bottom
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.2);
    doc.line(margin, currentY, margin + contentWidth, currentY);
    currentY += 6;

    // Trust badge
    doc.setFillColor(243, 240, 233);
    doc.roundedRect(margin, currentY, contentWidth, 22, 2, 2, "F");

    doc.setTextColor(13, 98, 109);
    doc.setFontSize(9);
    doc.setFont(hasFonts ? "Roboto" : "helvetica", "bold");
    doc.text("🛡️ ГАРАНТИЯ ЮРИДИЧЕСКОЙ БЕЗОПАСНОСТИ SIAM ASSIST", margin + 5, currentY + 6);

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(7.5);
    doc.setFont(hasFonts ? "Roboto" : "helvetica", "normal");
    const contractGuaranteeText = "Мы заключаем юридический договор обслуживания. В случае отказа со стороны Иммиграционной службы, Siam Assist гарантирует полный возврат средств.";
    const splitGuarantee = doc.splitTextToSize(contractGuaranteeText, contentWidth - 10);
    doc.text(splitGuarantee, margin + 5, currentY + 11);

    currentY += 28;

    // Contact Coordinates
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(7.5);
    doc.setFont(hasFonts ? "Roboto" : "helvetica", "normal");
    doc.text("Служба поддержки: info@siam-assist.com | Telegram: @siam_assist_legal", margin, currentY);
    doc.text("Siam Assist Co., Ltd. Bangkok Office: Interchange 21 Tower, Sukhumvit Road", margin + contentWidth, currentY, { align: "right" });

    // Save File
    const sanitizedTitle = service.title.replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`Siam_Assist_Checklist_${sanitizedTitle}.pdf`);

  } catch (error) {
    console.error("PDF Generation failed:", error);
    alert("К сожалению, при генерации PDF произошла ошибка. Пожалуйста, убедитесь в наличии стабильного подключения к интернету.");
  } finally {
    if (onProgress) onProgress(false);
  }
}
