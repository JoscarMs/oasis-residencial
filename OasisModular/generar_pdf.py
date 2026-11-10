from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        # Logo / Title
        self.set_font("helvetica", "B", 15)
        self.cell(0, 10, "Evidencia Individual - Actividad Autónoma 4 (S09)", border=False, align="C", new_x="LMARGIN", new_y="NEXT")
        self.set_font("helvetica", "I", 11)
        self.cell(0, 8, "Formularios Transaccionales Cabecera-Detalle", border=False, align="C", new_x="LMARGIN", new_y="NEXT")
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font("helvetica", "I", 8)
        self.cell(0, 10, f"Página {self.page_no()}", align="C")

pdf = PDF()
pdf.add_page()
pdf.set_font("helvetica", size=11)

# Student info
pdf.set_font("helvetica", "B", 12)
pdf.cell(0, 8, "Datos del Proyecto", new_x="LMARGIN", new_y="NEXT")
pdf.set_font("helvetica", size=11)
pdf.cell(0, 6, "Proyecto: Residencia Universitaria OASIS", new_x="LMARGIN", new_y="NEXT")
pdf.cell(0, 6, "Framework: Spring Boot + Spring Modulith (Java 21)", new_x="LMARGIN", new_y="NEXT")
pdf.ln(5)

pdf.set_font("helvetica", "B", 12)
pdf.cell(0, 8, "1. Descripción de la Implementación", new_x="LMARGIN", new_y="NEXT")
pdf.set_font("helvetica", size=11)
pdf.multi_cell(0, 6, "Se ha implementado el guardado transaccional de un formulario 'Cabecera-Detalle' en el módulo de Contratos. La transacción permite registrar un 'Contrato de Residencia' (Cabecera) junto con sus 'Detalles de Contrato' (Detalle), que incluyen la garantía y el alquiler mensual, todo en una sola operación atómica.")
pdf.ln(5)

pdf.set_font("helvetica", "B", 12)
pdf.cell(0, 8, "2. Entidades Utilizadas", new_x="LMARGIN", new_y="NEXT")
pdf.set_font("helvetica", size=11)
pdf.multi_cell(0, 6, "• Cabecera: ContratoResidencia\n• Detalle: DetalleContrato\nAmbas entidades están relacionadas mediante @OneToMany con CascadeType.ALL, garantizando la integridad referencial.")
pdf.ln(5)

pdf.set_font("helvetica", "B", 12)
pdf.cell(0, 8, "3. Evidencia del Código (Servicio Transaccional)", new_x="LMARGIN", new_y="NEXT")
pdf.set_font("courier", size=8)

codigo_servicio = '''@Override
@Transactional
public ContratoResponse formalizarContrato(ContratoRequest request) {
    // 1. Validar existencia de Huésped y Bloquear Habitación
    huespedService.obtener(request.getHuespedId());
    habitacionService.bloquearHabitacion(request.getHabitacionId());

    // 2. Construir contrato cabecera
    ContratoResidencia contrato = ContratoResidencia.builder()
            .huespedId(request.getHuespedId())
            .habitacionId(request.getHabitacionId())
            .fechaInicio(request.getFechaInicio()).estado("VIGENTE").build();

    // 3. Calcular detalles y subtotal
    BigDecimal total = BigDecimal.ZERO;
    for (DetalleContratoDTO detDTO : request.getDetalles()) {
        BigDecimal subtotal = detDTO.getPrecioUnitario()
                .multiply(BigDecimal.valueOf(detDTO.getCantidad()));
        DetalleContrato detalle = DetalleContrato.builder()
                .concepto(detDTO.getConcepto())
                .cantidad(detDTO.getCantidad())
                .precioUnitario(detDTO.getPrecioUnitario())
                .subtotal(subtotal).build();
        contrato.agregarDetalle(detalle);
        total = total.add(subtotal);
    }
    contrato.setTotalContrato(total);

    // 4. Guardar transaccionalmente
    return mapper.toResponse(repository.save(contrato));
}'''
pdf.multi_cell(0, 4, codigo_servicio, border=1)
pdf.ln(5)

pdf.set_font("helvetica", "B", 12)
pdf.cell(0, 8, "4. Pruebas y Validación", new_x="LMARGIN", new_y="NEXT")
pdf.set_font("helvetica", size=11)
pdf.multi_cell(0, 6, "Se han ejecutado las pruebas unitarias y de modularidad en Spring Boot garantizando que la arquitectura sigue intacta y el endpoint valida correctamente el Payload (Formulario) con @Valid, retornando HttpStatus.CREATED (201).")
pdf.ln(5)

pdf.set_font("courier", "B", 9)
pdf.multi_cell(0, 5, "[INFO] Tests run: 16, Failures: 0, Errors: 0, Skipped: 0\n[INFO] BUILD SUCCESS\n[INFO] Total time: 18.718 s", border=1)

pdf.output("Evidencia_Actividad_4_S09_OASIS.pdf")