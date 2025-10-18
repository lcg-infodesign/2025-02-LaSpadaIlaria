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

    //VARIABILI PER LA DIMENSIONE DEL GLIFO//
    let myValue = data["column0"]; //Estrae dalla riga corrente il valore della prima colonna (column0), che userai per decidere la dimensione dell’elemento da disegnare.
    let allValues = table.getColumn("column0"); //serve per calcolare dopo minimo e massimo e per normalizzare i valori
    let minValue = min(allValues);
    let maxValue = max(allValues); //Calcola il valore minimo e massimo presenti nella colonna
    let scaledValue = map(myValue, minValue, maxValue, 5, itemSize); //scalo i dati numerici in px. cioè se il valore è grande allora anche il disegno sarà grande, se è piccolo allora anche il disegno sarà piccolo.


    //in pratica serve per dire di controllare la colonna 0, di prendere tutti i valori e stabilire qual è quello più grand e quello più piccolo. in base a questo fare in modo che quello più grande abbia una dimensione maggiore, mentre quello più piccolo una dimensione minore. tutti gli altri valori hanno una dimensione che dipende da questi due valori

    // VARIABILI PER IL COLORE DEL GLIFO//
    let value2 = data["column2"]; //uguale a sopra, ma qui prendo di riferimento la colonna 2
    let allValues2 = table.getColumn("column2");
    let minValue2 = min(allValues2);
    let maxValue2 = max(allValues2);
    let value2Mapped = map(value2, minValue2, maxValue2, 0, 1);

  //i colori veri e propri ho deciso di definirli dopo, dentro drawGlyph() con la dicitura let baseColor1 e let baseColor2

    //VARIABILE PER LA ROTAZIONE//
    let value3 = data["column1"] || 0; // Usa column1 se esiste, altrimenti 0
    let allValues3 = table.getColumn("column1") || [0];
    let minValue3 = min(allValues3);
    let maxValue3 = max(allValues3); //esattamente come prima, otteniamo il valore minimo e massimo. poi tutti gli altri avranno l'attributo di conseguenza
    let rotation = map(value3, minValue3, maxValue3, 0, TWO_PI); //rimappi i valori numerici in un intervallo angolare da 0 a TWO_PI (cioè da 0° a 360° in radianti).

    // Calcolo la posizione nella griglia.
    let xPos = outerPadding + colCount * (itemSize + padding) + itemSize/2;
    let yPos = outerPadding + rowCount * (itemSize + padding) + itemSize/2;
    //outerPadding → sposta tutto verso l’interno (margine).colCount * (itemSize + padding) → distanza orizzontale tra le colonne. itemSize/2 → serve per centrare ogni glifo nel suo spazio (così disegni dal centro, non dall’angolo).


    // Disegno il glifo
    drawGlyph(xPos, yPos, scaledValue, value2Mapped, rotation); //per ogni riga del CSV, costruisci un glifo personalizzato basato sui dati di quella riga, e lo disegni nella giusta posizione sul canvas. lo disegni in base ai parametri elencati)

    // Aumento colcount. serve per digli di spostardi alla prossima colonna nella griglia
    colCount++;

    // Controllo se siamo a fine riga
    if (colCount == cols) {
      colCount = 0;
      rowCount++;
    }
  }
}

