export interface Producto {
  id_producto: number;
  nombre: string;
  precio_venta: number;
  stock_actual: number;
}

export interface Venta {
  id_venta: number;
  total: number;
  fecha_venta: string;
}

export interface DetalleVenta {
  id_detalle: number;
  id_venta: number;
  id_producto: number;
  cantidad: number;
  subtotal: number;
  nombre_producto?: string;
}
