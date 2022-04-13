import React, {useState} from 'react';
import Table from './Table';
import {generateRand, generateResourcesUsers, assignResourcesToUsers, setPriority} from './Generate'
import './App.css';

function App() {

  //Set Background-color
  document.body.style = 'background: #FFFFFF;';
  document.title = 'Maquilang, Deson | MP1';

    //States
    const [start, setStart] = useState(false);
    const [pending, setPending] = useState([]);
    const [newPending, setNewPending] = useState([]);
    const [ongoing, setOngoing] = useState([]);
    const [counters, setCounters] = useState([]);
    const [totalDuration, setTotalDuration] = useState([]);
    const [resources, setResources] = useState([]);
    
function setInitialOngoing(pending, resourceLabels){
      var initial = [];
      var currentPending = pending.slice(0);
      var newPending = [];
  
          var r = {}; //Set total duration
          pending.forEach(function(o) {
            r[o.resource] = (r[o.resource] || 0 ) + o.duration;
          })
  
          var result = Object.keys(r).map(function(k) {
            return {resource: k, duration: r[k], secondsOnHold: 0 ,stat: 'ONGOING' }
          });
  
          setTotalDuration(result)
  
         currentPending.map((data, index) => {
          if(index === 0) {
            currentPending[index]['status'] = 'ONGOING';
            initial.push(data);
          } 
          else {
            
            const found = initial.some(el => el.resource === data.resource || el.user === data.user);
  
            if (!found){ 
              currentPending[index]['status'] = 'ONGOING';
              initial.push(data);
            } else {
               newPending.push(currentPending[index]);
            }
          }
      });    
      // add space for uncalled resources due to conflict priority
      if(initial != null && resourceLabels != null) {
         if(initial.length != resourceLabels.length) {
          resourceLabels.map((data) => {
            const found = initial.some(el => el.resource === data);
    
            if(!found) {
              var info = {};
              info.user = "";
              info.resource = data;
              info.duration = "";
              info.status = "WAITING";
              initial.push(info);
            }
          });
        }
      }
  
      setStart(true);
      return {
        ongoing: initial.sort((a, b) => (a.resource > b.resource) ? 1 : -1),
        pending: newPending
      };
    }
  
function setUse() {
    var list = [...ongoing];
    var duration = [...totalDuration];
    var currentPending = [...pending];
    for(var i = 0; i <= list.length - 1; i++) {
        if(list[i]['duration'] !== 0 && list[i]['status'] != 'DONE' && list[i]['status'] != 'BUSY' && list[i]['status'] != 'WAITING') {
          //decrement duration per 1 second
          list[i]['duration'] = list[i]['duration'] - 1;
          if(duration[i]['duration'] !== 0) {
            duration[i]['stat'] = 'ONGOING';
            duration[i]['duration'] = duration[i]['duration'] - 1;
          }
        } else {
            //check pending list for specific resource
            if(duration[i]['stat'] === 'ON HOLD') {
              duration[i]['secondsOnHold'] = duration[i]['secondsOnHold'] + 1;
            }
            const stillPending = currentPending.filter((info) => info.resource === list[i]['resource'] && info.status === 'PENDING');

            if(stillPending.length === 0) {
              list[i]['user'] = '';
              list[i]['duration'] = '';
              list[i]['status'] = 'DONE';
              duration[i]['stat'] = 'FREE';
            } else {
              //resource still has pending users
              for(var j = 0; j < currentPending.length; j++) {
                //check if user is still using a resource then dont swap
                if(currentPending[j]['resource'] === list[i]['resource'] && currentPending[j]['status'] != 'ONGOING') {
                  const found = list.filter((info) => info.user === currentPending[j]['user'] && info.status !== 'BUSY' && info.status !== 'DONE'); 
                  console.log(found)
                  //if free then swap
                  if(found.length === 0) {
                    //do swapping        
                    list[i]['user'] = currentPending[j]['user'];
                    list[i]['duration'] = currentPending[j]['duration'];
                    list[i]['status'] = 'ONGOING';

                    currentPending[j]['user'] = 'ONGOING';
                    currentPending[j]['resource'] = 'ONGOING';
                    currentPending[j]['status'] = 'ONGOING';
                    break;
                  } else {
                    //if not free, go to next user
                    list[i]['status'] = 'BUSY';
                    duration[i]['stat'] = 'ON HOLD';
                  }
                }
              }
        }
      }
    setCounters(list);
  }
}

  React.useEffect(() => {
    const resourceLabels = generateResourcesUsers();
    const userLabels = generateResourcesUsers();
    const list = assignResourcesToUsers(resourceLabels, userLabels)
    const initialPending = setPriority(list);
    const data =  setInitialOngoing(initialPending, resourceLabels);
    setOngoing(data.ongoing);
    setPending(data.pending);

  },[]);

  React.useEffect(() => {
      if(start === true) {
        setInterval(function () {
          setUse();
          }, 1000); 
      }
  },[start]);

  
  return (
    <main>
      <h1 className="text-start header">
        <button className='reload-btn' onClick={() => window.location.reload()}>
        Restart
      </button>
      </h1>
      <div className="row">
        <div className="col-sm-6">
           <Table
            type={"ongoing"}
            tableData={ongoing}
            headingColumns={["CURRENT USER","RESOURCE ID", "DURATION IN SECONDS", "RESOURCE STATUS"]}
            />
          </div>
          <div className='col-sm-6'>
            <Table
            type={"resources"}
            tableData={totalDuration}
            headingColumns={["RESOURCE ID", "TOTAL DURATION TO BE FREE IN SECONDS", "TOTAL DURATION ON HOLD IN SECONDS", "STATUS"]}
            />
        </div>
      </div>
      <div className='row'>        
          <Table
            type={"pending"}
            tableData={pending}
            newPending={newPending}
            headingColumns={["USER ID","RESOURCE ID","DURATION IN SECONDS", "STATUS"]}
            />
      </div>
      <h1 className="text-end">
        MACHINE PROBLEM 1
      </h1>
      <h1 className="text-end">
        RESOURCE MANAGER
      </h1>
      <h1 className="text-end">
        DESON G. MAQUILANG
      </h1>
    </main>
  );
}

export default App;