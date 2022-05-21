
(function(){

    let btnAddFolder = document.querySelector("#addFolder");
    let divContainer = document.querySelector("#container");
    let templates = document.querySelector("#templates");
    let btnAddTextFile = document.querySelector("#addTextFile");


    btnAddFolder.addEventListener("click", AddFolder);
    btnAddTextFile.addEventListener("click", AddTextFile);
    let resources = [];
    let cfid = -1;
    let rid = 0;

    function AddFolder()
    {
        let rname = prompt("Enter Folder Name.");
        if(rname != null){
            rname = rname.trim();
        }

        if(!rname){ // empty name validation
            alert("Empty name is not allowed.");
            return;
        }

        // uniqueness validation
        
        let alreadyExists = resources.some(r => r.rname == rname && r.pid == cfid);
        if(alreadyExists == true){
            alert(rname + " is already in use. Try some other name");
            return;
        }
        
        let pid = cfid;
        rid++;

        AddFolderHTMl(rname, rid, pid);

        resources.push({
            rid : rid,
            rname : rname,
            rtype : "folder",
            pid: cfid
        });

        saveTostorage();
    }

    function AddTextFile()
    {
        let rname = prompt("Enter File's Name.");
        if(rname != null){
            rname = rname.trim();
        }

        if(!rname){ // empty name validation
            alert("Empty name is not allowed.");
            return;
        }

        // uniqueness validation
        
        let alreadyExists = resources.some(r => r.rname == rname && r.pid == cfid);  // && r.rtype == "text-file"
        if(alreadyExists == true){
            alert(rname + " is already in use. Try some other name");
            return;
        }
        
        let pid = cfid;
        rid++;

        addTextFileHTML(rname, rid, pid);

        resources.push({
            rid : rid,
            rname : rname,
            rtype : "text-file",
            pid: cfid
        });

        saveTostorage();
    }

    function AddFolderHTMl(rname, rid, pid)
    {
        let divFolderTemplate = templates.content.querySelector(".folder");
        let divFolder = document.importNode(divFolderTemplate, true);
        
        let spanRename = divFolder.querySelector("[action=rename]");
        let spanDelete = divFolder.querySelector("[action=delete]");
        let spanView = divFolder.querySelector("[action=view]");

        spanRename.addEventListener("click", renameFolder);
        spanDelete.addEventListener("click", deleteFolder);
        spanView.addEventListener("click", viewFolder);


        let divName = divFolder.querySelector("[purpose=name]");
        divName.innerHTML = rname;
        divFolder.setAttribute("rid", rid);
        divFolder.setAttribute("pid", pid);

        divContainer.appendChild(divFolder);
    }

    function addTextFileHTML(rname, rid, pid)
    {
        let divTextFileTemplate = templates.content.querySelector(".text-file");
        let divTextFile = document.importNode(divTextFileTemplate, true);
        
        let spanRename = divTextFile.querySelector("[action=rename]");
        let spanDelete = divTextFile.querySelector("[action=delete]");
        let spanView = divTextFile.querySelector("[action=view]");

        spanRename.addEventListener("click", renameTextFile);
        spanDelete.addEventListener("click", deleteTextFile);
        spanView.addEventListener("click", viewTextFile);


        let divName = divTextFile.querySelector("[purpose=name]");
        divName.innerHTML = rname;
        divTextFile.setAttribute("rid", rid);
        divTextFile.setAttribute("pid", pid);

        divContainer.appendChild(divTextFile);   
    }

    function renameFolder()
    {
        let nrname = prompt("Enter folder's name");
        if(nrname != null){
            nrname = nrname.trim();
        }

        if(!nrname){ // empty name validation
            alert("Empty name is not allowed.");
            return;
        }

        // console.log(this);
        let spanRename = this;
        let divFolder = spanRename.parentNode;
        // console.log(divFolder);
        let divName = divFolder.querySelector("[purpose=name]");
        let orname = divName.innerHTML;
       
        let ridTBU = parseInt(divFolder.getAttribute("rid"));

        if(orname == nrname){
            alert("Please Enter a New Name.");
            return;
        }

        let alreadyExists = resources.some(r => r.rname == nrname && r.pid == cfid);
        if(alreadyExists == true){
            alert(nrname + " already exists");
            return;
        }

        divName.innerHTML = nrname; // in html

        let resource = resources.find(r => r.rid == ridTBU);
        resource.rname = nrname;

        saveTostorage();
    }

    function renameTextFile()
    {
        let nrname = prompt("Enter file's name");
        if(nrname != null){
            nrname = nrname.trim();
        }

        if(!nrname){ // empty name validation
            alert("Empty name is not allowed.");
            return;
        }

    
        let spanRename = this;
        let divTextFile = spanRename.parentNode;
        let divName = divTextFile.querySelector("[purpose=name]");
        let orname = divTextFile.innerHTML;
       
        let ridTBU = parseInt(divTextFile.getAttribute("rid"));

        if(orname == nrname){
            alert("Please Enter a New Name.");
            return;
        }

        let alreadyExists = resources.some(r => r.rname == nrname && r.pid == cfid);
        if(alreadyExists == true){
            alert(nrname + " already exists");
            return;
        }

        divName.innerHTML = nrname; // in html

        let resource = resources.find(r => r.rid == ridTBU);
        resource.rname = nrname;

        saveTostorage();
    }

    function deleteFolder(){
       let spanDelete = this;      //    console.log(this);
       let divFolder = spanDelete.parentNode;  //    console.log(divFolder);
      
       let divName = divFolder.querySelector("[purpose=name]");
       let FidTBD = parseInt(divFolder.getAttribute("rid"));
       let fname = divName.innerHTML;

       
       let childrenExists = resources.some(r => r.pid == FidTBD);
       let sure = confirm(`Are you sure you want to delete ${fname}?` + (childrenExists? ". It also has children.": ""));
       if(!sure){
           return;
       }

       

    divContainer.removeChild(divFolder);
    deleteHelper(FidTBD);  
    saveTostorage();
    }

    function deleteHelper(fidTBD){

        let children = resources.filter(r => r.pid == fidTBD)
        for(let i = 0; i < children.length; i++){
            deleteHelper(children[i].rid);
        }
        
        let ridx = resources.findIndex(r=> r.rid == fidTBD);
        resources.splice(ridx,1);
    }

    function deleteTextFile(){
        let spanDelete = this;      //    console.log(this);
        let divTextFile = spanDelete.parentNode;  //    console.log(divFolder);
       
        let divName = divTextFile.querySelector("[purpose=name]");
        let FidTBD = parseInt(divTextFile.getAttribute("rid"));
        let fname = divName.innerHTML;
 
        let sure = confirm(`Are you sure you want to delete ${fname}?`);
        if(!sure){
            return;
        }
 
     divContainer.removeChild(divTextFile);
     
     let ridx = resources.findIndex(r=> r.rid == FidTBD);
     resources.splice(ridx,1);
     
     saveTostorage();
    }

    function viewFolder()
    {
        let spanView = this;
        let divFolder = spanView.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");

        let fname = divName.innerHTML;
        let fid = parseInt(divFolder.getAttribute("rid"));

        cfid = fid;
        divContainer.innerHTML = "";

        for(let i = 0; i < resources.length; i++){
            if(resources[i].pid == cfid){
                if(resources[i].rtype == "folder"){
                    AddFolderHTMl(resources[i].rname, resources[i].rid, resources[i].pid);
                } else if(resources[i].rtype == "text-file"){
                    addTextFileHTML(resources[i].rname, resources[i].rid, resources[i].pid);
                }
            }
        }

    }

    function viewTextFile()
    {
        let spanView = this;
        let divTextFile = spanView.parentNode;
        let divName = divTextFile.querySelector("[purpose='name']");

        let fname = divName.innerHTML;
        let fid = parseInt(divTextFile.getAttribute("rid"));

        
    }

    function saveTostorage(){
        // console.log(resources);
        let rjson = JSON.stringify(resources);
        // console.log(rjson);
        localStorage.setItem("data", rjson);
    }

    function loadFromStorage()
    {
        let rjson = localStorage.getItem("data");
        if(!rjson)
        {
            return;
        }

        resources = JSON.parse(rjson);
        for(let i = 0; i < resources.length; i++){
            if(resources[i].pid == cfid){
                if(resources[i].rtype == "folder"){
                    AddFolderHTMl(resources[i].rname, resources[i].rid, resources[i].pid);
                } else if(resources[i].rtype == "text-file"){
                    addTextFileHTML(resources[i].rname, resources[i].rid, resources[i].pid);
                }
            }

            if(resources[i].rid > rid){
                rid = resources[i].rid;
            }
        }
    }



    loadFromStorage();
})();


