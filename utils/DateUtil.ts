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