 // Date pentru simulare
        const historicalData = [
            { year: 2016, employment: 17.9, unemployment: 45.1 },
            { year: 2017, employment: 20.1, unemployment: 42.6 },
            { year: 2018, employment: 20.4, unemployment: 41.7 },
            { year: 2019, employment: 20.5, unemployment: 41.4 },
            { year: 2020, employment: 20.5, unemployment: 41.4 },
            { year: 2021, employment: 21.2, unemployment: 39.4 },
            { year: 2022, employment: 19.7, unemployment: 43.7 },
            { year: 2023, employment: 18.7, unemployment: 46.6 },
            { year: 2024, employment: 19.2, unemployment: 45.1 }
        ];

        const projectionWithoutReform = [
            { year: 2022, employment: 19.7, unemployment: 43.7 },
            { year: 2023, employment: 19.4, unemployment: 44.6 },
            { year: 2024, employment: 19.1, unemployment: 45.4 },
            { year: 2025, employment: 18.8, unemployment: 46.3 },
            { year: 2026, employment: 18.5, unemployment: 47.1 },
            { year: 2027, employment: 18.2, unemployment: 48.0 },
            { year: 2028, employment: 17.9, unemployment: 48.9 },
            { year: 2029, employment: 17.8, unemployment: 49.1 },
            { year: 2030, employment: 17.8, unemployment: 49.1 }
        ];

        const projectionWithReform = [
            { year: 2022, employment: 19.7, unemployment: 43.7 },
            { year: 2023, employment: 21.5, unemployment: 38.6 },
            { year: 2024, employment: 23.3, unemployment: 33.4 },
            { year: 2025, employment: 25.1, unemployment: 28.3 },
            { year: 2026, employment: 27.1, unemployment: 22.6 },
            { year: 2027, employment: 29.1, unemployment: 16.9 },
            { year: 2028, employment: 30.7, unemployment: 12.3 },
            { year: 2029, employment: 31.4, unemployment: 10.3 },
            { year: 2030, employment: 32.0, unemployment: 8.6 }
        ];

        function showTab(tabId) {
            // Ascunde toate tab-urile
            const tabs = document.querySelectorAll('.tab-content');
            tabs.forEach(tab => tab.classList.remove('active'));
            
            const buttons = document.querySelectorAll('.tab');
            buttons.forEach(button => button.classList.remove('active'));
            
            // Afișează tab-ul selectat
            document.getElementById(tabId).classList.add('active');
            event.target.classList.add('active');
        }

        function createEmploymentChart() {
            const ctx = document.getElementById('employmentChart').getContext('2d');
            
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030],
                    datasets: [{
                        label: 'Date istorice',
                        data: [17.9, 20.1, 20.4, 20.5, 20.5, 21.2, 19.7, 18.7, 19.2, null, null, null, null, null, null],
                        borderColor: '#1f77b4',
                        backgroundColor: '#1f77b4',
                        borderWidth: 3,
                        fill: false,
                        spanGaps: false
                    }, {
                        label: 'Fără reformă',
                        data: [null, null, null, null, null, null, 19.7, 19.4, 19.1, 18.8, 18.5, 18.2, 17.9, 17.8, 17.8],
                        borderColor: '#ff7f0e',
                        backgroundColor: '#ff7f0e',
                        borderWidth: 2,
                        borderDash: [8, 8],
                        fill: false,
                        spanGaps: false
                    }, {
                        label: 'Cu reformă',
                        data: [null, null, null, null, null, null, 19.7, 21.5, 23.3, 25.1, 27.1, 29.1, 30.7, 31.4, 32.0],
                        borderColor: '#2ca02c',
                        backgroundColor: '#2ca02c',
                        borderWidth: 3,
                        fill: false,
                        spanGaps: false
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: false
                        },
                        legend: {
                            position: 'top',
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            min: 15,
                            max: 35,
                            title: {
                                display: true,
                                text: 'Rata de ocupare (%)'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Anul'
                            }
                        }
                    }
                }
            });
        }

        function createUnemploymentChart() {
            const ctx = document.getElementById('unemploymentChart').getContext('2d');
            
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030],
                    datasets: [{
                        label: 'Date istorice',
                        data: [45.1, 42.6, 41.7, 41.4, 41.4, 39.4, 43.7, 46.6, 45.1, null, null, null, null, null, null],
                        borderColor: '#1f77b4',
                        backgroundColor: '#1f77b4',
                        borderWidth: 3,
                        fill: false,
                        spanGaps: false
                    }, {
                        label: 'Fără reformă',
                        data: [null, null, null, null, null, null, 43.7, 44.6, 45.4, 46.3, 47.1, 48.0, 48.9, 49.1, 49.1],
                        borderColor: '#ff7f0e',
                        backgroundColor: '#ff7f0e',
                        borderWidth: 2,
                        borderDash: [8, 8],
                        fill: false,
                        spanGaps: false
                    }, {
                        label: 'Cu reformă',
                        data: [null, null, null, null, null, null, 43.7, 38.6, 33.4, 28.3, 22.6, 16.9, 12.3, 10.3, 8.6],
                        borderColor: '#2ca02c',
                        backgroundColor: '#2ca02c',
                        borderWidth: 3,
                        fill: false,
                        spanGaps: false
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: false
                        },
                        legend: {
                            position: 'top',
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            min: 5,
                            max: 55,
                            title: {
                                display: true,
                                text: 'Rata de șomaj (%)'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Anul'
                            }
                        }
                    }
                }
            });
        }

        // Inițializare grafice când se încarcă pagina
        document.addEventListener('DOMContentLoaded', function() {
            createEmploymentChart();
            createUnemploymentChart();
        });