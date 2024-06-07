export function dateFormat(inputDate, format) {
    /* Date format details.
     * MMMM = November
     * MMM = Nov
     * MM = 11
     * dd = 31
     * yyyy = 2022
     * yy = 22
     */
    // parse the input date
    const date = new Date(inputDate);

    // extract the parts of the date
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    // replace the month
    if (format.indexOf("MMMM") > -1) {
        // replace the long month
        const longMonth = date.toLocaleString('default', { month: 'long' });
        format = format.replace("MMMM", longMonth);
    } else if (format.indexOf("MMM") > -1) {
        // replace the short month
        const shortMonth = date.toLocaleString('default', { month: 'short' });
        format = format.replace("MMM", shortMonth);
    } else {
        format = format.replace("MM", month.toString().padStart(2, "0"));
    }

    // replace the year
    if (format.indexOf("yyyy") > -1) {
        format = format.replace("yyyy", year.toString());
    } else if (format.indexOf("yy") > -1) {
        format = format.replace("yy", year.toString().substr(2, 2));
    }

    // replace the day
    format = format.replace("dd", day.toString().padStart(2, "0"));

    return format;
}