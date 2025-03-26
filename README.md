import random

ListaPalabras = [palabras = ["CUITELO", "PEIXE", "SURRIA", "CABILDRO", "NORDÉS", "CACHELO", "CANELA", "CANCELLA", "CHEPA", "CANAVEIRA", 
"CARDOXO", "HERBA", "VENTÁ", "PERNAL", "CEIBE", "XUNTOIRO", "CINTO", "CALDADA", "LONXE", "BRUXA", "PORTA", "SABICHAR", 
"CALDEIRO", "AUGUEIRO", "CÁNABO", "MAGOSTO", "ARTESA", "CATAR", "BIDUREIRA", "TIXELLA", "CHAVE", "BÍGARO", "TORBÓN", 
"COLLO", "CHANCIAR", "ADOITO", "BINOCA", "CACHA", "CUITELLO", "CIMPRE", "AUGUA", "GURGUTAR", "CIMÓN", "COTRA", "CURUXA", 
"GARFELLA", "CHOVER", "CHAMBÓN", "CABALO", "CALECER", "CINZA", "TROBO", "ANDAREGO", "CAZOLA", "CHARAMUZA", "CORTÍA", 
"CANELLA", "AXEITO", "BARRUZO", "ATOPAR", "LLÚA", "BINOCRA", "LLUME", "COFAR", "INVERNO", "CACAREXO", "PARVA", "OUTONO", 
"BROSA", "LLABRAR", "RELUSTRO", "CONTO", "RUBIÉN", "CHOCIA", "FONTE", "CAZOLO", "CALOFRÍO", "AVELÍA", "GOUÑO", "ENCANTO", 
"DEMO", "BURACO", "ARGUTE", "ARRIBADA", "ALFONIL", "MOLÍN", "CEBOLLA", "XANTAR", "SEÑARDÁ", "ARREBOLAR", "BEIZOS", 
"BANZAO", "EMPORONDAR", "LLANXIR", "ALUMAR", "CARRACHA", "COCHO", "CORTE", "COSTUME", "LLEITE", "POLAVILLA", "CABAZO", 
"CENTEO", "ENCANTA", "AMEICER", "COLOBRA", "ALLUADO", "ALLINDAR", "CHUCHO", "BÓCHIGA", "BARBADELLA", "CANCELA", "LEITE", 
"NOUGO", "BORONA", "ONTE", "ARREBOLLAR", "ARROLAR", "CADEA", "CIROLA", "COSCO", "OSMAR", "CERZO", "GALOCHEIRO", "COLO", 
"AXELAR", "ALBORADA", "ABALLÓN", "BÓCHEGA", "ARRAS", "CORZO", "BERZO", "CORDA", "BASADOIRO", "ANEINAR", "MUITO", "DEVECER", 
"CORADA", "PENEDO", "LOUXA", "VENTO", "LABRAR", "CONCA", "ARIZO", "NOITE", "CORRADA", "CARONCHO", "CERNO", "CHIFRO", 
"CINCHA", "CACHOLA", "AUGUA", "CHANTAR", "CORTELLO", "LANXIR", "AXEITAR", "BIDUREIRA", "CORNADA", "CALTRE", "BAFO", 
"CHOCO", "BIDUREIRO", "BUDUEIRA", "XELAR", "BUCHINCHE", "DEDOS", "PEITO", "CHEGAR", "CAMBEIRO", "TIXELA", "LEIRA", 
"ANTROIDO", "COMPAÑA", "CHOZA", "CERZO", "BOTELO", "ANDOLÍA", "AMARREGA", "CABANA", "MAÑÁ", "COUCE", "BORDELLO", "ESCARPÍN", 
"BALDRE", "COUSA", "AVENTAR", "CONEXO", "ABALANCIO", "CADRIL", "CORVO", "SERRA", "CAMÍN", "CABODANO", "CONTA", "CAPADOIRA", 
"COUZ", "CIMBRAR", "TOXAL", "BAFO", "PIGUREIRO", "ESTRAR", "AVEZADO", "NOXO", "COPRA", "CEBOLA", "BARRUZAR", "XEITO", 
"BARRUNTAR", "CURTIO", "ZARRO", "ESTRUME", "BORDELO", "FEREIXOLO", "XUNTAR", "CASTELO", "SENRA", "AMOLAR", "CHINELA", 
"APEIRO", "ASOURIA", "ALBARDA", "ALPENDRE", "CALITRO", "CARRACHA", "CABOZO", "ANGAZO", "FALOUPO", "TARRÉN", "XEIRA", 
"CHICHO", "CONTAR", "CEREIXOLO", "CUCÍA", "ACHANTAR", "ANADA", "BARBADELA", "NORTADA", "PODRE", "CALANDRIA", "CLARIÉN", 
"CORDAL", "CELERGAS", "ANOUGAR", "MAZARICÓN", "MOURO", "CARREIRO", "BACOTEXO", "CHAMAR", "CINCAR", "CALANDRA", "FARRAPO", 
"CIMÓIS", "CLARÉN", "BEIZOS", "BOTELLO", "BRAÑA", "ALDROMEIRO", "BRANCO", "ALPEIRADA", "BANZAO", "AFOGAR", "COLDO", 
"COUTO", "CONTER", "ALLUMAR", "CASCA", "CORRA", "RINCHÍN", "BULLIGAR", "ABONDO", "RELLUSTRO", "BOUZA", "CORNO", "LLOUXA", 
"ENTROIDO", "DEDAS", "CUITO", "GALOCHA", "CASTELLO", "AGOIRO", "LUME", "COIRO", "CALTRIR", "EMBOZADA", "MOCHICAS", "VERAO", 
"CAMPÁ", "LÚA", "CARQUEIXA", "ALUADO", "AMARELO", "AVEZO", "FIGUEIRA", "CIGUA", "LLONXE", "CABALLO", "CHOCA", "MASEIRA", 
"APOUCADO", "ESMOLER", "CHEIRAR", "TARDÍA", "COCÍA", "XIPRO", "CORRADA", "CHUFAR", "CHORAR", "CALOSTRO", "POLAVILA", 
"DESACOUGO", "MOFO", "CANGREXO", "ABERTAL", "ALINDAR", "ALBEIRAR", "TRASNO", "CARÍS", "ATANIGAR", "BRAÑEIRO", "MOFOSO", 
"NOIRO", "PANDIAR", "CELLERGAS", "ACOUGO", "TROBO", "CADÍA", "CANOUCO", "ROSADA", "CORPO", "FOGUEIRA", "ANOITECER", 
"CABANÓN", "COIDAR", "AZUCRE", "ARROLLAR", "ALBEITRE", "DEIXAR", "CISCO", "CHIRLA", "BULIGAR", "XELADA", "AMEIXA", 
"XARMOLO", "TERRA", "AXUDAR", "CANTO", "PIGUREIRA", "POUCO", "TRABATEL", "EIRO", "CASARADA"]
]

intentos = 5

class Colors:
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    ENDC = '\033[0m'      

def verde(pos):
    return Colors.OKGREEN + pos + Colors.ENDC

def azul(pos):
    return Colors.OKBLUE + pos + Colors.ENDC

resp = "S"
while resp.upper() == "S":
    
    sol = random.choice(ListaPalabras)

    print("\nREGLAS:")
    print("1- Si la letra es verde, es correcta en su posición.")
    print("2- Si la letra es azul, está en la palabra pero en otra posición.")
    print("3- Si la letra no tiene color, no está en la palabra.")
    print("4- Tienes 5 intentos.\n")

    for _ in range(intentos):
        print("")
        palabra = input("Introduce una palabra: ").strip().upper()
        print("")

        if len(palabra) != len(sol):
            print(f"La palabra debe tener {len(sol)} letras.")
            continue

        if palabra == sol:
            print(verde(palabra))
            print("¡Acertaste!")
            break
        else:
            resultado = ""
            for i in range(len(sol)):
                if palabra[i] == sol[i]:
                    resultado += verde(palabra[i])
                elif palabra[i] in sol:
                    resultado += azul(palabra[i])
                else:
                    resultado += palabra[i]
            print(resultado)
    
    else:
        print(f"Te quedaste sin intentos. La palabra era: {sol}")

    resp = input("¿Quieres jugar de nuevo? (S/N): ").strip().upper()
    while resp not in ["S", "N"]:
        resp = input("Introduce S o N: ").strip().upper()

print("¡Adiós!")
