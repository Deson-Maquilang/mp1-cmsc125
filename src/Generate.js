//Generate a random number min - max
export const generateRand = (min, max) => {
  const rand = min + Math.random() * (max - min);
  
  return Math.floor(rand)
}

  //Generate a randum number of resources or users 
export const generateResourcesUsers = () => {
    const quantity = generateRand(1,30);
    var resourceData = [];

    for(var i = 0; i < quantity - 1; i++) {
      var resource = generateRand(1,30);

      //No duplicate resources or users
      if(resourceData.includes(resource) === false) {
          resourceData.push(resource);
      } else {
        i--;
      }
    }

    return resourceData;
}

//Assign resources to users
export const assignResourcesToUsers = (resourceLabels, userLabels) => {
  
    var list = [];
    userLabels.map((user) => {
      const quantity = generateRand(1,30);
      var tempResource = resourceLabels.slice();
      
      for(var i = 0; i < quantity - 1; i++) {

        //if all resourceLabels are used by a user
        if(tempResource.length === 0) {
            break; //exit out loop
        }
        var randomDuration = generateRand(1,30);
        const randomIndex = Math.floor(Math.random() * tempResource.length);
        var randomResource = tempResource[randomIndex];

        var info = {};
        info.user = user;
        info.resource = randomResource;
        info.duration = randomDuration;
        info.status = "PENDING";

        list.push(info);
        tempResource.splice(randomIndex, 1);
      }
    
    });

    return list;
    
}

export const setPriority = (list) => {
    const sortByResource = list.sort((a, b) => (a.resource < b.resource) ? 1 : -1);
    const priorityList = sortByResource.sort((a, b) => (
      a.resource == b.resource && a.user > b.user) ? 1 : -1);

    return priorityList;
    
  }