//Viewmodel réteg
var statusTexts = {
    'new': 'Új',
    'ready': 'Teljesítve',
    'pending': 'Függőben',
};
var statusClasses = {
    'new': 'danger',
    'ready': 'success',
    'pending': 'warning',
};

function decorateErrors(errorContainer) {
    return errorContainer.map(function (e) {
        e.statusText = statusTexts[e.status];
        e.statusClass = statusClasses[e.status];
        return e;
    });
}

module.exports = decorateErrors;