const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const axios = require('axios');


contextBridge.exposeInMainWorld('myAPI', {
  checkFiles: async (file1Path, file2Path,userName) => {

    try {
      
     const file1Exists=  fs.existsSync(file1Path)
     const file2Exists=  fs.existsSync(file2Path)
    
     setInterval(function() {
      if(file1Exists===true){
      
        fs.stat(file1Path, (err, stats) => {
          if (err) throw err;
        
          const bufferSize = 1024;
          const buffer = Buffer.alloc(bufferSize);
        
          fs.open(file1Path, 'r', (err, fd) => {
            if (err) throw err;
        
            fs.read(fd, buffer, 0, bufferSize, stats.size - bufferSize, (err, bytesRead, buffer) => {
              if (err) throw err;
        
              const lastLineIndex = buffer.lastIndexOf('\n', buffer.length - 2);
              const lastLine = buffer.toString('utf-8', lastLineIndex + 1).trim();
        
              console.log(lastLine);
              const cleanedLine = lastLine.replace(/5010(.*)$/, '5010');
  
              console.log(cleanedLine);
              
                if(cleanedLine==="IDS 24 Online Interface has Started Listening on Socket 5010"){
                  
                  axios.post('http://101.53.135.35:3002/login', {
                    username: userName,
                  }, {
                    headers: {
                      'accept': '*/*',
                      'accept-language': 'en-US,en;q=0.9,hi;q=0.8',
                      'content-type': 'application/json',
                      'Referer': 'http://101.53.135.35:3002/',
                      'Referrer-Policy': 'strict-origin-when-cross-origin'
                    }
                  })
                  .then(function (response) {
                    console.log(response);
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
           
                }
            
            
            });
          });
        });
       }
     }, 30000);
   

      return { file1Exists, file2Exists };
   
    } catch (err) {
      throw new Error(err);
    }
  }
});
