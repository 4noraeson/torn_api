GM_addStyle(`
#x_api {
  background-color: #ead1d1;
  border-radius: 0.5em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 1em;
  padding: 0.5em;
  position: fixed;
  right: 0;
  visibility: hidden;
}
#x_api > * {
  padding: 0.3em
}
#x_api span {
  cursor: pointer;
  position: absolute;
  right: 0.1em;
  top: 0.1em;
}
#x_api strong {
  margin: auto;
}
#x_api input {
  text-align: center;
}

#x_api_error {
  cursor: pointer;
  color: #FF9F9F;
  font-size: 1.1em;
  padding:0.5em;
  position: fixed;
  right: 0;
  visibility: hidden;
}
`)

if (document.querySelector('#x_api') === null) {
  document.querySelector('body').insertAdjacentHTML('afterbegin',`
    <div id="x_api">
      <span>X</span>
      <strong>API Key</strong>
      <input type="text">
      <p></p>
    </div>
    <div id="x_api_error"><strong>API ERROR:&nbsp;</strong><span></span></div>
  `)
}

let api_key = localStorage.getItem('x_api_key')

const torn_api = async (args) => {
  const a = args.split('.'); if (a.length!==3) throw(`Bad argument in torn_api(args, key): ${args}`)
  const res = await fetch(`https://api.torn.com/${a[0]}/${a[1]}?selections=${a[2]}&key=${api_key}`)
  const r = await res.json()
  if (r.error) {
    console.error('API ERROR', r.error)
    switch (r.error.code) {
      case 1:
      case 2:
        localStorage.removeItem('x_api_key')
        document.querySelector('#x_api p').innerText = r.error.code +' - '+ r.error.error
        document.querySelector('#x_api').style.visibility = 'visible'
        break
      default:
        document.querySelector('#x_api_error span').innerText = r.error.code +' - '+ r.error.error
        document.querySelector('#x_api_error').style.visibility = 'visible'
        break
    }
  }
  return r
}

document.querySelector('#x_api span').addEventListener('click',(e) => {
  document.querySelector('#x_api').style.visibility = 'hidden'
})

document.querySelector('#x_api input').addEventListener('change',(e) => {
  api_key = e.target.value
  torn_api('user..basic').then( (r) => {
    if (r.player_id) {
      localStorage.setItem('x_api_key', api_key)
      document.querySelector('#x_api').style.visibility = 'hidden'
    }
  })
})
if (!api_key) document.querySelector('#x_api').style.visibility = 'visible'

document.querySelector('#x_api_error').addEventListener('click',(e) => {
  window.open('https://api.torn.com/', '_blank')
})
