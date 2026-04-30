export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

export const formatToLongDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-KE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date);
}

export const formatToShortDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-KE', {
        year: '2-digit',
        month: 'short',
        day: 'numeric',
    }).format(date);
}
