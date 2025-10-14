//2 creo una variabile globale chiamata table//
let table;


//1 carico i dati nel preload//
function preload() {
  table = loadTable("assets/dataset.csv", "csv", "header");
  //3 per vedere se ho caricato i dati devo://
  console.log(table);
  
  //4 come riesco a mettere i miei dati in una griglia con un pudding nel margine e una sistemazione con colonne righe.  per fare in modo che la pagina sia grande come il mio schermo devo scrivere windowWith, wondowHeight. Devo decidere quanti sono gli elementi, quando è l'ingombro massimo degli elementi, quanto è il pudding dei vari elementi, quanti elementi ci sono in una riga quindi quante righe mi servono per metterli tutti//
}

//5 creiamo una variabile per definire il pudding esterno//
function setup() {
  
  //console.log(table);//

  let outerPadding = 20; 
  let padding = 18;
  let itenSize= 30; //questa è per la grandezza degli elementi
  
  

  //6 devo calcolare il numero delle colonne nella larghezza della pagina. queesto numero che esce potrebbe non essere intero, quindi gli dico di arrotondarlo per difetto mettendo il floor//
  let cols = floor ((windowWidth - outerPadding *2) / (itenSize + padding));

  //7 voglio vedere se funziona fino ad ora//
  //console.log("colonne: ", cols);//

  //8 voglio una seconda variabile per sapere quanti righe ci sono////9 devo arrotondate quindi per eccesso//
  let rows = ceil(table.getRowCount() / cols);

  

  let totalHeight = outerPadding * 2 + rows * itenSize + (rows - 1) * padding; //questo mi serve per capire l'altezza totale

  
  
  //creo il canvas//
  createCanvas (windowWidth, windowHeight);
  background ("coral");

console.log("cols: ", cols, "rows: ", rows);

  let colCount = 0;

  for(let rowNumber = 0; rowNumber < table.getRowCount(); rowNumber) {
    
    //carico dati della riga//
    let data = table.getRow(rowNumber).obj;
    
    let xPos = outerPadding + colCount * (itenSize + padding);

    //vediamo se il ciclo funziona disegnando un rettangolo//
    rect(xPos, 50, itenSize, itenSize);
    //aumento con colcount//
    colCount++;


  }
}

function draw() {
  // put drawing code here
}
