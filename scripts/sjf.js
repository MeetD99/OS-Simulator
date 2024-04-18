class Process{
    constructor(pid, at, bt){
        this.pid = pid;
        this.at = at;
        this.bt = bt;
        this.ct = 0;
        this.wt = 0;
        this.tat = 0;
    }
}

class Processor{
    constructor(){
        this.currentProcess = null;
    }
    run(scheduler) {
        while(true){
            scheduler.scheduleNextProcess();
            if(scheduler.processes.length === 0){
                break;
            }
        }
    
    }
}

class Scheduler{
    constructor(){
        this.processes = [];
        this.time = 0;
        this.ganttSequence = [];
        this.startingTimes = [];
        this.completionTimes = [];
        this.waitingTimes = [];
        this.turnAroundTimes = [];
    }

    addProcess(pid, at, bt){
        this.processes.push(new Process(pid, at, bt));
    }

    findNextProcess() {
        // Filter processes that have arrived
        const arrivedProcesses = this.processes.filter(process => process.at <= this.time);
        
        if (arrivedProcesses.length === 0) {
            this.time++;
            return null; // No process has arrived yet
        }
        
        // Sort arrived processes by burst time
        arrivedProcesses.sort((a, b) => {
            if (a.bt === b.bt) {
                return (a.pid - b.pid);
            }
            return (a.bt - b.bt);
        });
        
        return arrivedProcesses[0];
    }

    scheduleNextProcess() {
        const nextProcess = this.findNextProcess();
        
        if (nextProcess) {
            let id = nextProcess.pid - 1;
            this.startingTimes.push(this.time);
            this.time += nextProcess.bt;
            this.ganttSequence.push(nextProcess);
            this.completionTimes[id] = this.time;
            this.turnAroundTimes[id] = (this.time - nextProcess.at);
            this.waitingTimes[id] = (this.time - nextProcess.at - nextProcess.bt);
            this.removeProcess(nextProcess);
        } else {
           console.log("No Process to schedule at the moment!");        }
    }

    removeProcess(process){
        const index = this.processes.indexOf(process);
        if (index !== -1) {
            this.processes.splice(index, 1);
        }
    }
}

function createGanttChart(scheduler) {
    const ganttChart = document.getElementById('ganttChart');
    const timeline = document.getElementById('timeline');
    timeline.innerHTML = '';
    timeline.classList.add('timeline');
    ganttChart.innerHTML = '';
    ganttChart.classList.add('gantt-chart');
    let time = 0;
    let sequence = scheduler.ganttSequence;
    let starting_times = scheduler.startingTimes;

    const timeElement_0 = document.createElement('div');
    timeElement_0.classList.add('timeEle');
    timeElement_0.textContent = '0';
    timeElement_0.style.width = '6px';
    timeline.appendChild(timeElement_0);

    for(let i = 0; i < sequence.length; i++){
        if(starting_times[i] > time){
            const taskElement = document.createElement('div');
            taskElement.classList.add('task');
            taskElement.style.width = `${(starting_times[i] - time)*20}em`;
            taskElement.style.backgroundColor = 'aqua';
            ganttChart.appendChild(taskElement);    
            

            const timeElement = document.createElement('div');
            timeElement.classList.add('timeEle');
            timeElement.style.width = `${(starting_times[i] - time)*20}em`;

            time += starting_times[i];

            const timeSpan = document.createElement('span');
            timeSpan.textContent = time;
            timeSpan.style.textAlign = 'right';
            timeElement.appendChild(timeSpan);
            timeline.appendChild(timeElement);
        }

        const taskElement_p = document.createElement('div');
        taskElement_p.classList.add('task');
        taskElement_p.style.width = `${sequence[i].bt * 20}em`;
        const spanElement_p = document.createElement('span');
        spanElement_p.textContent = `P${sequence[i].pid}`;
        taskElement_p.appendChild(spanElement_p);
        ganttChart.appendChild(taskElement_p);
        time += sequence[i].bt;

        const timeElement_p = document.createElement('div');
        timeElement_p.classList.add('timeEle');
        timeElement_p.style.width = `${sequence[i].bt * 20}em`;
        const timeSpan_p = document.createElement('span');
        timeSpan_p.textContent = time;
        timeSpan_p.style.textAlign = 'right';
        timeElement_p.appendChild(timeSpan_p);
        timeline.appendChild(timeElement_p);
    }

}
 
function getAverage(array){
    let sum = 0;
    for(let i = 0; i< array.length; i++){
        sum += array[i];
    }
    sum /= array.length;
    return sum.toFixed(2);
}

var process_button = document.getElementById("process_no_button");
var simulate_button = document.getElementById("simulate-button");
let process_number = 0;
// Function to handle key press event
function handleKeyPress(event) {
    // Check if the pressed key is Enter (key code 13)
    if (event.keyCode === 13) {
        // Trigger button click event based on button visibility
        if ((process_button.style.display !== 'none' && simulate_button.style.display === 'none') ||
            (process_number != parseInt($(".process_no").val()))) {
            process_number = parseInt($(".process_no").val());
            process_button.click();
        } else if (simulate_button.style.display !== 'none') {
            simulate_button.click();
        }
        
    }

    if (event.target.id === 'process_no_input' && event.key === 'Enter') {
        process_button.click(); // Simulate click on the process button
    }
}

// Add event listener for key press on the document
document.addEventListener("keypress", handleKeyPress);


$(document).ready(function(){

    $(".process_no_button").click(function(){
        $(".results").empty();
        document.getElementById("Gantt-Title").style.display = 'none';
        const ganttChart = document.getElementById('ganttChart');
        ganttChart.innerHTML = '';
        ganttChart.style.border = 'none';
        $("#timeline").empty();

        var processNo = parseInt($(".process_no").val());
        if(isNaN(processNo) || processNo <= 0) {
            alert("Please enter a valid number of processes.");
            return;
        }
        
        var tableHtml = '<table class="table"><thead><tr><th scope="col">Process ID</th><th scope="col">Arrival Time</th><th scope="col">Burst Time</th></tr></thead><tbody>';
        for(var i = 1; i <= processNo; i++) {
            tableHtml += '<tr><td>' + i + '</td><td><input type="number" class="arrival_time" id="arrival_time_' + i + '"></td><td><input type="number" class="burst_time" id="burst_time_' + i + '"></td></tr>';
        }
        tableHtml += '</tbody></table>';
        
        $("#table-container").html(tableHtml);
        $(".table_div button").show(); // Show the Simulate button after table creation
        // $(".process_no").focus();
    });

    $(".table_div button").click(function() {
        // Check if all arrival and burst times are filled
        var allFilled = true;
        var processNo = parseInt($(".process_no").val());
        $(".arrival_time, .burst_time, .pid").each(function() {
            if ($(this).val() === "") {
                allFilled = false;
                return false; // exit each loop early
            }
        });
        
        if (allFilled) {
            // Initialize Processor and Scheduler
            let processor = new Processor();
            let scheduler = new Scheduler();

            // Add processes to the scheduler
            for (let i = 1; i <= processNo; i++) {
                let pid = i;
                let at = parseInt($("#arrival_time_" + i).val());
                let bt = parseInt($("#burst_time_" + i).val());
                scheduler.addProcess(pid, at, bt);
            }


            // Run the scheduler
            processor.run(scheduler);
            let resultTableHtml = '<table class="table"><thead><tr><th scope="col">Process ID</th><th scope="col">Completion Time</th><th scope="col">Turn Around Time</th><th scope="col">Waiting Time</th></tr></thead><tbody>';
            for(let i = 0; i < processNo; i++){
                resultTableHtml += '<tr><td>' + (i+1) + '</td><td>' + scheduler.completionTimes[i] + '</td><td>' + scheduler.turnAroundTimes[i] + '</td><td>' + scheduler.waitingTimes[i] + '</td></tr>'; 
            }
            resultTableHtml += '<tr><td></td><td style="font-weight: bold;">Avg</td><td>' + getAverage(scheduler.turnAroundTimes) + '</td><td>' + getAverage(scheduler.waitingTimes) + '</td></tr>';
            resultTableHtml += '</tbody></table>';

            $(".results").html(resultTableHtml);
            $("#Gantt-Title").show();
            createGanttChart(scheduler);
            
            // $(".process_no").focus();
        }
        else{
            alert("Please fill in all arrival and burst times!");
        }
    });
});
