window.IMS = window.IMS || {};
IMS.mockData = IMS.mockData = (function (mockData, undefined) {
    var oneReservation = {
        planedItems: [
            { id: 'Jasper', date: '2011-15-15', time: '14:00-15:00', count: 2 },
            { id: 'sean', date: '2011-15-15', time: '14:00-15:00', count: 2 },
            { id: 'york', date: '2011-15-15', time: '14:00-15:00', count: 2 },
        ],
        unPlanedItems: [
           { id: 'Jane', date: '2011-15-15', time: '14:00-15:00', count: 2 },
           { id: 'Poe', date: '2011-15-15', time: '14:00-15:00', count: 2 },
           { id: 'Jeffery', date: '2011-15-15', time: '14:00-15:00', count: 2 },
        ]
    },

    oneDetailOrder = {
        orderItemID: '20131115ABCD',
        status: '在途中',
        basicInformation: {
            driver: 'jasper',
            phone: '1502664565',
            carNumber: '沪A',
            carType: 'Big Car',
            arrivalDate: '2013-12-01',
            earliestTime: '14:00',
            latestTime: '20:00'
        },
        deliveryOrders: [
            { orderNumber: '2013001' },
            { orderNumber: '2013002' },
            { orderNumber: '2013003' },
            { orderNumber: '2013004' }
        ]
    };

    return {
        mockedReservation: oneReservation,
        mockedDetailOrder: oneDetailOrder,

    }
})();