let table;

function preload() {
  // Carica il dataset CSV
  table = loadTable("assets/dataset_2.csv", "csv", "header");
}

function setup() {
  // Controllo se ho caricato i dati
  let outerPadding = 55; //spazio vuoto tra i bordi del canvas e la griglia di elementi.
  let padding = 19;  //spazio tra gli elementi (tra una “cella” e l’altra della griglia).
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

// FUNZIONE PRINCIPALE PER DISEGNARE I GLIFI
function drawGlyph(x, y, size, colorValue, rotation) {
  push(); // Salva lo stato di disegno corrente
  
  // Applica trasformazioni
  translate(x, y);
  rotate(rotation);
  
  // Definisci i colori di base per la famiglia di glifi
  let baseColor1 = color(1, 107, 97) //colore principale
  let baseColor2 = color(205, 44, 88) //colore secondario
  
  // Interpola tra i due colori in base al valore
  let glyphColor = lerpColor(baseColor1, baseColor2, colorValue); //lerpColor calcola il valore intermedio. il risultato viene salvato nella variabile glyphColor
  fill(glyphColor); //qua gli dico di riempirlo in base alla variabile
  stroke(60); //gli dico che il contorno deve essere grigio
  strokeWeight(0.3); //in questo caso do lo spessore dello stroke
  
  // REGOLE PER LA FAMIGLIA DI GLIFI:
  // 1. Tutti i glifi hanno un elemento centrale
  // 2. Tutti i glifi hanno elementi radiali
  // 3. La complessità aumenta con la dimensione
  
  // Elemento centrale (sempre presente)
  ellipse(0, 0, size * 0.4, size * 0.4); //qui definisco il cerchio dandogli le dimensioni. la dimensione è proporzionale alla grandezza del glifo.
  
  // Elementi radiali - numero variabile in base alla dimensione
  let radialElements = max(3, floor(map(size, 10, 30, 3, 8))); //map(size, 10, 30, 3, 8) → mappa la dimensione del glifo (size) in un numero di bracci tra 3 e 10. size = 5 → 3 bracci. size = 30 → 10 bracci. i valori intermedi sono proporzionali
  //con max garantisco il numero minimo di bracci=3 anche se la dimensione dovesse essere minore.
  let angleStep = TWO_PI / radialElements; //calcola l’angolo tra un braccio e l’altro in radianti.
  

  //CICLO PER DISEGNARE I BRACCI//
  for (let i = 0; i < radialElements; i++) { 
    let angle = i * angleStep; //determina la direzione del braccio
    
    // Lunghezza delle braccia radiali varia con la dimensione
    let armLength = size * 0.6;
    
    // Calcola la posizione finale del braccio
    let endX = cos(angle) * armLength;
    let endY = sin(angle) * armLength;
    
    // Disegna il braccio radiale
    line(0, 0, endX, endY);
    
    // Aggiungi elementi terminali ai bracci
    // La forma varia in base al valore di colore
    if (colorValue > 0.5) {
      // se il colore determina un valore alto, maggiore di 0.5 allora crea un'ellissi con queste caratteristiche
      ellipse(endX, endY, size * 0.15, size * 0.15);
    } else {
      // invece se i valori sono minori devi creare dei Rettangoli 
      push(); //l'ho dovuto mettere per isolare la forma, in questo modo la rotazione e la traslazione non interferiscono
      translate(endX, endY); //devo portare l'origine alla fine del braccio
      rotate(angle); //ruoto il rettangolo in modo che segua la rotazione del corpo centrale
      rectMode(CENTER);
      rect(0, 0, size * 0.15, size * 0.15);
      pop();
    }
  }
  
  // Elementi aggiuntivi per glifi più grandi
  if (size > 15) { //qui gli sto dicendo di procedere solo se la size è superiore a 15
    // Anello esterno per glifi di media dimensione
    noFill();
    stroke(glyphColor);
    ellipse(0, 0, size * 0.8, size * 0.8);
    
    // Punti sugli angoli per glifi grandi
    if (size > 20) { //gli dico di procedere solo se la size è superiore a 20
      fill(glyphColor);
      noStroke();
      for (let i = 0; i < radialElements; i++) {
        let angle = i * angleStep;
        let pointX = cos(angle) * (size * 0.35); //osizione del punto calcolata lungo la direzione del braccio
        let pointY = sin(angle) * (size * 0.35);
        ellipse(pointX, pointY, size * 0.08, size * 0.08);
      }
    }
  }
  
  pop(); // Ripristina lo stato di disegno precedente
}

function draw() {
  // Non è necessario per questo esempio
}