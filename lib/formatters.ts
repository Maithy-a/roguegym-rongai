export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

export const formatToLongDate = (date: string): string => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export const formatToShortDate = (date: string): string => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export const formatMonths = (months: number) => {
    return months === 1 ? "month" : "months" 
}
