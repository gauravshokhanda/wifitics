if (typeof myAPI === 'undefined') {
    const myAPI = require('electron').contextBridge.exposeInMainWorld('myAPI', {
      checkFiles: async (file1Path, file2Path) => {
        try {
          const file1Exists = await fs.promises.access(file1Path, fs.constants.F_OK);
          const file2Exists = await fs.promises.access(file2Path, fs.constants.F_OK);
          return { file1Exists, file2Exists };
        } catch (err) {
          throw new Error(err);
        }
      }
    });
  }
  
  const file1Input = document.getElementById('file1');
  const file2Input = document.getElementById('file2');
  const userNameInput =document.getElementById('property')
  const checkButton = document.getElementById('check');
  
  checkButton.addEventListener('click', async () => {
    const file1Path = file1Input.value;
    const file2Path = file2Input.value;
    console.log(userNameInput,"input")
    const userName= userNameInput.value
    console.log(userName,"value")
    try {
      const { file1Exists, file2Exists  } = await myAPI.checkFiles(file1Path, file2Path,userName);
      const resultElem = document.getElementById('result');
     
      if (file1Exists && file2Exists) {
        resultElem.textContent = 'Both files exist';
      } else if (file1Exists) {
        resultElem.textContent = 'File 1 exists';
      } else if (file2Exists) {
        resultElem.textContent = 'File 2 exists';
      } else {
        resultElem.textContent = 'Neither file exists';
      }
      
    } catch (err) {
      console.error(err);
    }
  });
  