const tablaResultados = document.querySelector('.webform-results-table')
tablaResultados.querySelectorAll('tr').forEach((fila) => {
    fila.querySelectorAll('td').forEach((celda, i) => {
        if(i === 16){
            const link = celda.querySelector('a')
            if(link){
                link.href = 'https' + link.href.slice(4)
            }
        }
    })
})