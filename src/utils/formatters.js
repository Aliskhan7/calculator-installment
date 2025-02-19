export const formatNumber = (num) => {
    return Math.trunc(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};