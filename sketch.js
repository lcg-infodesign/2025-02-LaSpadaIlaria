let table;

function preload() {
  // Carica il dataset CSV
  table = loadTable("assets/dataset_2.csv", "csv", "header");
}

function setup() {
  // Controllo se ho caricato i dati
  let outerPadding = 55; //spazio vuoto tra i bordi del canvas e la griglia di elementi.
  let padding = 15;  //spazio tra gli elementi (tra una “cella” e l’altra della griglia).
  let itemSize = 37; //dimensione (lato) di ogni “oggetto” o cella da disegnare.

  // Calcolo il numero di colonne
  let cols = floor((windowWidth - outerPadding * 2) / (itemSize + padding)); //(windowWidth - outerPadding * 2) → prende la larghezza totale della finestra e toglie i margini esterni sinistro e destro. (itemSize + padding) → è lo spazio totale occupato da ogni elemento (dimensione + spazio tra elementi).floor() → arrotonda per difetto (es. 7.8 diventa 7), così non si disegna una colonna “incompleta”
  let rows = ceil(table.getRowCount() / cols); //restituisce quante righe ci sono nel CSV (cioè quanti “dati” totali). Dividendo per cols si calcola quante righe servono per mostrare tutti i dati. ceil() → arrotonda per eccesso (es. 4.2 → 5), perché serve una riga in più anche se l’ultima non è piena.
  let totalHeight = outerPadding * 2 + rows * itemSize + (rows - 1) * padding; //Calcola l’altezza totale del canvas. 

  // Creo il canvas
  createCanvas(windowWidth, totalHeight); //crea lo spazio di disegno con la larghezza pari alla finestra
  background(252, 249, 234);

  console.log("cols: ", cols, " rows: ", rows); //verifico che il numero totale di righe e colonne siano corretti

  let colCount = 0; 
  let rowCount = 0; //servono per tenere traccia della posizione nella griglia. ogni volta che disegno un glifo rolcount aumenta, poi quando arrivo alla fine della riga si resetta tornando a zero, ma aumenta di 1 rowcount. 

  // Itero attraverso tutte le righe del dataset
  for (let rowNumber = 0; rowNumber < table.getRowCount(); rowNumber++) { //for serve a ripetere un’operazione per ogni riga. table.getRowCount() restituisce quante righe ci sono nel CSV.
    // Carico dati della riga
    let data = table.getRow(rowNumber).obj; //Prende la riga con indice rowNumber es. rownumber = 0 restituisce un oggetto speciale di tipo p5.TableRow, cioè una riga della tabella che contiene i valori. in questo caso obj È una proprietà di p5.TableRow che converte la riga in un normale oggetto JavaScript.

    