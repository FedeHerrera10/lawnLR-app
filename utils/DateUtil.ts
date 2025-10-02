// Helpers fecha (DD/MM/AAAA)
export const formatDate = (d: Date) => {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    //return `${dd}-${mm}-${yyyy}`;
    return `${yyyy}-${mm}-${dd}`;
  };

export const parseDate = (s?: string) => {
    if (!s) return undefined;
    const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!m) return undefined;
    const [_, dd, mm, yyyy] = m;
    const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    return isNaN(d.getTime()) ? undefined : d;
  };

  export function convertDateFormat2(dateString: string) {
    return dateString.split('/').join('-');
  }

  export const formatearHora = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  };



  export function getMonthRange(year: number, month: number) {
    // month: 1 = Enero, 12 = Diciembre
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0); // día 0 del siguiente mes = último día del mes actual
  
    const formatDate = (date: Date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    };
  
    return {
      firstDay: formatDate(firstDay),
      lastDay: formatDate(lastDay),
    };
  }
  