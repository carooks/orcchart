import { toPng } from 'html-to-image';

export async function exportSVG(element: HTMLElement, filename: string = 'orgchart.svg'): Promise<void> {
  try {
    const svgElement = element.querySelector('svg');
    if (!svgElement) {
      throw new Error('No SVG element found');
    }

    const bbox = svgElement.getBBox();
    const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;

    const padding = 40;
    clonedSvg.setAttribute('viewBox', `${bbox.x - padding} ${bbox.y - padding} ${bbox.width + padding * 2} ${bbox.height + padding * 2}`);
    clonedSvg.setAttribute('width', (bbox.width + padding * 2).toString());
    clonedSvg.setAttribute('height', (bbox.height + padding * 2).toString());

    const svgData = new XMLSerializer().serializeToString(clonedSvg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    downloadBlob(blob, filename);
  } catch (error) {
    console.error('Failed to export SVG:', error);
    throw error;
  }
}

export async function exportPNG(element: HTMLElement, filename: string = 'orgchart.png'): Promise<void> {
  try {
    const svgElement = element.querySelector('svg');
    if (!svgElement) {
      throw new Error('No SVG element found');
    }

    const bbox = svgElement.getBBox();
    const padding = 40;

    const canvas = document.createElement('canvas');
    const scale = 2;
    canvas.width = (bbox.width + padding * 2) * scale;
    canvas.height = (bbox.height + padding * 2) * scale;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.scale(scale, scale);
    ctx.translate(-bbox.x + padding, -bbox.y + padding);

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    await new Promise<void>((resolve, reject) => {
      img.onload = () => {
        ctx.drawImage(img, bbox.x, bbox.y);
        URL.revokeObjectURL(url);
        resolve();
      };
      img.onerror = reject;
      img.src = url;
    });

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Failed to export PNG:', error);
    throw error;
  }
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
