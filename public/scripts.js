var dictionary = fetch('./wordList.txt').then((res) =>{
    return res.text()
}).then((data)=>{ 
    dictionary = data.toString().split("\n")
    for( w in dictionary)
    dictionary[w]= dictionary[w].replace(/\r/g, "")
    return dictionary
})
const doGuess = async () => {
const items = await dictionary;
const tG = document.querySelector('[data-guess-grid]')
const aC = document.querySelector('[data-alert-container]')
const kB = document.querySelector('[data-keyboard]')
const word_length = 5
const flipDuration = 500
const testword = items[Math.floor(Math.random() * items.length)]
start()
function start()
{   
    
    document.addEventListener('click',handleMouseClick)
    document.addEventListener('keydown',handleKeyClick)
}
function stop()
{   
    document.removeEventListener('click',handleMouseClick)
    document.removeEventListener('keydown',handleKeyClick)
}
function handleMouseClick(e)
{
   if(e.target.matches('[data-key]'))
   {
    keyPressed(e.target.dataset.key)
    return
   }
   if(e.target.matches('[data-enter]'))
   {
       submitWord()
       return
   }
   if(e.target.matches('[data-delete]'))
   {
       deleteKey()
       return
   }

}
function handleKeyClick(e)
{
    if(e.key === 'Enter')
    {
    submitWord()
    return
    }
    if(e.key === 'Delete' || e.key === 'Backspace')
    {
        deleteKey()
        return
    }
   if(e.key.match(/^[a-z]$/))
   {
    keyPressed(e.key)
    return
   } 
}
function keyPressed(key)
{
 const activeTile = getActiveTile()
     if(activeTile.length >= word_length) return
 
 const nextEmptyTile = tG.querySelector(':not([data-letter])')
 if(nextEmptyTile == undefined)
  return
 nextEmptyTile.dataset.letter = key.toLowerCase()
 nextEmptyTile.textContent = key
 nextEmptyTile.dataset.state = 'active'
}
function deleteKey()
{
    let getTiles = getActiveTile()
    let lastTile =  getTiles[getTiles.length-1]
    if(lastTile == null) return
    lastTile.textContent = ''
    delete lastTile.dataset.state
    delete lastTile.dataset.letter
}
function submitWord()
{
    const activeTile = [...getActiveTile()]
    if(activeTile.length != word_length)
{    
    displayAlert("Type more letter") 
    return 
}

    const input = activeTile.reduce((word,tile) =>{
     return word + tile.dataset.letter
    },"")
    
   if(!items.includes(input))
   {
    displayAlert("Invalid Word") 
    return
   }
stop()
activeTile.forEach((...params) => flipTiles(...params,input))
   
}
function flipTiles(tile,index,array,input)
{
  const letter = tile.dataset.letter
  const key = kB.querySelector(`[data-key = "${letter}"i]`) 
  setTimeout(()=>{
      tile.classList.add("flip")
  },index*flipDuration / 2)
  tile.addEventListener("transitionend",()=>
  {
    tile.classList.remove("flip") 
    if(testword[index] === letter)
    {
        tile.dataset.state = 'correct'
        key.classList.add('correct')
    }
    else if(testword.includes(letter))
    {
        tile.dataset.state = 'wrong-index'
        key.classList.add('wrong-index')
    }
    else
    {
      tile.dataset.state = 'wrong'
      key.classList.add('wrong')
    }
    if(index === array.length -1)
    {
        tile.addEventListener("transitionend",()=> {
            start()
            checkWinStatus(input,tile)
        },{once: true})
    }
  },{once: true})
}  
function getActiveTile()
{
    return tG.querySelectorAll('[data-state = active]')
}
function displayAlert(message,duration = 800)
{
    const alert = document.createElement("div")
    alert.textContent = message
    alert.classList.add("alert")
    aC.prepend(alert)
    if(duration == null) return
        setTimeout(() => {
          alert.classList.add('hide') 
          alert.addEventListener("transitionend", () => alert.remove()) 
        }, duration)
    
}
function checkWinStatus(input,tile){
    if(input == testword)
    {
        displayAlert("Impressive You Won",10000)
        stop()
        return
    }
    const ntile = tG.querySelectorAll(':not([data-letter])')
    if(ntile.length == 0)
    {
        let w = testword.toUpperCase();
        let m = "is the correct word"
        let result = w.concat(" ",m);    
    displayAlert(result,7500)
    stop()
     
    }
}
  } 
doGuess ()
function reload() {  
    location.reload();  
    }  