"""
Invoice generation using ReportLab.
Generates a PDF invoice for a given Order instance.
"""
import io
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.enums import TA_CENTER, TA_RIGHT


def generate_invoice_pdf(order) -> bytes:
    """
    Generate a PDF invoice for the given order.
    Returns bytes (PDF content).
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=15*mm, leftMargin=15*mm,
                            topMargin=15*mm, bottomMargin=15*mm)
    styles = getSampleStyleSheet()
    story = []

    # ------- Header -------
    title_style = ParagraphStyle('title', parent=styles['Title'], fontSize=20, textColor=colors.HexColor('#1a1a2e'))
    story.append(Paragraph('INVOICE', title_style))
    story.append(Spacer(1, 4*mm))

    subtitle = f'Invoice #{str(order.order_id)[:8].upper()}  |  {order.created_at.strftime("%d %b %Y")}'
    story.append(Paragraph(subtitle, styles['Normal']))
    story.append(Spacer(1, 8*mm))

    # ------- Billing Info -------
    billing_data = [
        ['Billed To', 'Ship To'],
        [
            Paragraph(
                f'{order.user.full_name or order.user.email}<br/>'
                f'{order.user.email}',
                styles['Normal']
            ),
            Paragraph(
                f'{order.shipping_full_name}<br/>'
                f'{order.shipping_address_line1}, {order.shipping_address_line2}<br/>'
                f'{order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}<br/>'
                f'{order.shipping_country}<br/>'
                f'Phone: {order.shipping_phone}',
                styles['Normal']
            ),
        ],
    ]
    billing_table = Table(billing_data, colWidths=[90*mm, 90*mm])
    billing_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#e8f4f8')),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(billing_table)
    story.append(Spacer(1, 8*mm))

    # ------- Items Table -------
    item_headers = ['#', 'Product', 'Unit Price', 'Qty', 'Subtotal']
    item_rows = [item_headers]
    for idx, item in enumerate(order.items.all(), start=1):
        item_rows.append([
            str(idx),
            item.product_name,
            f'₹{item.product_price:.2f}',
            str(item.quantity),
            f'₹{item.subtotal:.2f}',
        ])

    items_table = Table(item_rows, colWidths=[10*mm, 90*mm, 30*mm, 20*mm, 30*mm])
    items_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a1a2e')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('ALIGN', (2, 0), (-1, -1), 'RIGHT'),
        ('GRID', (0, 0), (-1, -1), 0.3, colors.lightgrey),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f5f5f5')]),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(items_table)
    story.append(Spacer(1, 6*mm))

    # ------- Totals -------
    totals_data = [
        ['Subtotal', f'₹{order.subtotal:.2f}'],
        ['Discount', f'-₹{order.discount:.2f}'],
        ['Shipping', f'₹{order.shipping_charge:.2f}'],
        ['Total', f'₹{order.total:.2f}'],
    ]
    totals_table = Table(totals_data, colWidths=[140*mm, 40*mm])
    totals_table.setStyle(TableStyle([
        ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
        ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, -1), (-1, -1), 12),
        ('LINEABOVE', (0, -1), (-1, -1), 1, colors.black),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(totals_table)
    story.append(Spacer(1, 10*mm))

    # ------- Footer -------
    footer_style = ParagraphStyle('footer', parent=styles['Normal'], fontSize=8, textColor=colors.grey, alignment=TA_CENTER)
    story.append(Paragraph('Thank you for shopping with us!', footer_style))

    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
