// Dashboard 1 Morris-chart


Morris.Area({
        element: 'extra-area-chart',
        data: [{
                    period: 'Enero',
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0
            
                }, {
                    period: 'Febrero',
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0
                }, {
                    period: 'Marzo',
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0
                }, {
                    period: 'Abril',
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0
                }, {
                    period: 'Mayo',
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0
                }, {
                    period: 'Junio',
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0
                }, {
                    period: 'Julio',
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0
                }


                ],
                lineColors: ['#f75b36', '#00b5c2', '#8698b7', '#8348b7', '#1648b7'],
                xkey: 'period',
                ykeys: ['1', '2', '3', '4', '5'],
                labels: ['1', '2', '3', '4', '5'],
                pointSize: 0,
                lineWidth: 0,
                resize:true,
                fillOpacity: 0.8,
                behaveLikeLine: true,
                gridLineColor: '#e0e0e0',
                hideHover: 'auto'
        
    });
