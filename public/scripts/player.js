document.addEventListener("DOMContentLoaded", async () => {
  async function loadStats() {
    try {
      // Fetch player stat history
      const historyResponse = await fetch('/api/player/stats/history');
      const statHistory = await historyResponse.json();

      // If no stat history, alert the user
      if (!statHistory || statHistory.length === 0) {
        alert('No stat history available.');
        return;
      }

      // Prepare the battle stats history data (from statHistory)
      const battleStatsHistory = statHistory.map(stat => ({
        strength: stat.strength,
        defense: stat.defense,
        speed: stat.speed,
        dexterity: stat.dexterity
      }));

      // Prepare labels for the x-axis (could be dates or indexes)
      const labels = statHistory.map((_, index) => `Stat Point ${index + 1}`);

      // Update battle stats chart
      if (window.battleChart) {
        window.battleChart.data.labels = labels;
        window.battleChart.data.datasets[0].data = battleStatsHistory.map(stat => stat.strength);
        window.battleChart.data.datasets[1].data = battleStatsHistory.map(stat => stat.defense);
        window.battleChart.data.datasets[2].data = battleStatsHistory.map(stat => stat.speed);
        window.battleChart.data.datasets[3].data = battleStatsHistory.map(stat => stat.dexterity);
        window.battleChart.update();
      } else {
        const battleStats = {
          labels: labels,
          datasets: [
            {
              label: 'Strength',
              data: battleStatsHistory.map(stat => stat.strength),
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              fill: true,
              borderWidth: 2,
            },
            {
              label: 'Defense',
              data: battleStatsHistory.map(stat => stat.defense),
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: true,
              borderWidth: 2,
            },
            {
              label: 'Speed',
              data: battleStatsHistory.map(stat => stat.speed),
              borderColor: 'rgba(153, 102, 255, 1)',
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              fill: true,
              borderWidth: 2,
            },
            {
              label: 'Dexterity',
              data: battleStatsHistory.map(stat => stat.dexterity),
              borderColor: 'rgba(255, 159, 64, 1)',
              backgroundColor: 'rgba(255, 159, 64, 0.2)',
              fill: true,
              borderWidth: 2,
            }
          ]
        };

        window.battleChart = new Chart(document.getElementById('battle-stats-chart'), {
          type: 'line',
          data: battleStats,
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            },
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
            }
          }
        });
      }

      // Prepare the work stats history data (from statHistory)
      const workStatsHistory = statHistory.map(stat => ({
        manuallabor: stat.manuallabor,
        intelligence: stat.intelligence,
        endurance: stat.endurance
      }));

      // Update work stats chart
      if (window.workChart) {
        window.workChart.data.labels = labels;
        window.workChart.data.datasets[0].data = workStatsHistory.map(stat => stat.manuallabor);
        window.workChart.data.datasets[1].data = workStatsHistory.map(stat => stat.intelligence);
        window.workChart.data.datasets[2].data = workStatsHistory.map(stat => stat.endurance);
        window.workChart.update();
      } else {
        const workStats = {
          labels: labels,
          datasets: [
            {
              label: 'Manual Labor',
              data: workStatsHistory.map(stat => stat.manuallabor),
              borderColor: 'rgba(54, 162, 235, 1)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              fill: true,
              borderWidth: 2,
            },
            {
              label: 'Intelligence',
              data: workStatsHistory.map(stat => stat.intelligence),
              borderColor: 'rgba(255, 159, 64, 1)',
              backgroundColor: 'rgba(255, 159, 64, 0.2)',
              fill: true,
              borderWidth: 2,
            },
            {
              label: 'Endurance',
              data: workStatsHistory.map(stat => stat.endurance),
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: true,
              borderWidth: 2,
            }
          ]
        };

        window.workChart = new Chart(document.getElementById('work-stats-chart'), {
          type: 'line',
          data: workStats,
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            },
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
            }
          }
        });
      }

    } catch (error) {
      console.error('Error fetching player data:', error);
      alert('Failed to load player data.');
    }
  }

  // Load the stats initially
  await loadStats();

  // Force update button
  document.getElementById('force-update-btn').addEventListener('click', async () => {
    try {
      const response = await fetch('/api/player/stats/', { method: 'GET' });
      if (response.ok) {
        alert('Stats updated!');
        await loadStats();
      } else {
        alert('Failed to update stats.');
      }
    } catch (error) {
      console.error('Error forcing update:', error);
      alert('Failed to force update.');
    }
  });

});
