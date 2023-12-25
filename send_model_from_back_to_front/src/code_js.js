
// function pyfun1(){
//     const { spawn } = window.require('child_process');
//     return new Promise((resolve, reject) => {
//       const process = spawn('python', ['./b.py']);
//     });
// }

// function pyfun2(arg1,arg2){
//     const { spawn } = window.require('child_process');
//     return new Promise((resolve, reject) => {
//       const process = spawn('python', ['./a.py',arg1,arg2]);
//     });
// }

// function pyfun3(){
//     const { spawn } = window.require('child_process');
//     return new Promise((resolve, reject) => {
//       const process = spawn('python', ['./create_new_pcd.py','./pcd_with_png/034.npy','./pcd_with_png/026.npy']);
//     });
// }

// function pyfun4(){
//     const { spawn } = window.require('child_process');
//     return new Promise((resolve, reject) => {
//       const process = spawn('python', ['./launch.py','./pcd_with_png/036.npy']);
//     });
// }

// function pyfun5(){
//     const { spawn } = window.require('child_process');
//     return new Promise((resolve, reject) => {
//       //参数先usecolor,再canedit
//       const process = spawn('python', ['./view_scene.py','./pcd_with_png/042.npy','true','true']);
//     });
// }

// function pyfun6(){
//   const { spawn } = window.require('child_process');
//   return new Promise((resolve, reject) => {
//     const process = spawn('python', ['./upload']);
//   });
// }

function pyfun1(){
  const { spawn } = window.require('child_process');
  return new Promise((resolve, reject) => {
    const process = spawn('python', ['./b.py']);
  });
}

function pyfun2(arg1,arg2){
  const { spawn } = window.require('child_process');
  return new Promise((resolve, reject) => {
    const process = spawn('python', ['./a.py',arg1,arg2]);
  });
}

function pyfun3(){
  const { spawn } = window.require('child_process');
  return new Promise((resolve, reject) => {
    const process = spawn('python', ['./create_new_pcd.py','./pcd_with_png/034.npy','./pcd_with_png/026.npy']);
  });
}

function pyfun4(){
  const { spawn } = window.require('child_process');
  return new Promise((resolve, reject) => {
    const process = spawn('python', ['./launch.py','./pcd_with_png/036.npy']);
  });
}

function pyfun5(){
  const { spawn } = window.require('child_process');
  return new Promise((resolve, reject) => {
    //参数先usecolor,再canedit
    const process = spawn('python', ['./view_scene.py','./pcd_with_png/042.npy','true','true']);
  });
}

function pyfun6(){
  const { spawn } = window.require('child_process');
  return new Promise((resolve, reject) => {
  const process = spawn('python', ['./upload.py']);
  });
}

pyfun1()
pyfun2()
pyfun3()
pyfun4()
pyfun5()
pyfun6()
