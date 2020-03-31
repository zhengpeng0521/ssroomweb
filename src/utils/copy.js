import {message} from 'antd';
export async function copy(id) {
  const innerText = document.getElementById(id).innerText;
  const oInput = document.createElement('input');
  oInput.value = innerText;
  document.body.appendChild(oInput);
  oInput.select(); // 选择对象
  document.execCommand("Copy"); // 执行浏览器复制命令
  oInput.style.display='none';
  message.success("复制成功", 2);
}