export interface KotlinFile {
  name: string;
  path: string;
  description: string;
  code: string;
}

export const KOTLIN_PROJECT_FILES: KotlinFile[] = [
  {
    name: 'MainActivity.kt',
    path: 'app/src/main/java/com/campusnav/MainActivity.kt',
    description: 'Point d\'entrée principal Android avec Jetpack Compose et NavHost',
    code: `package com.campusnav

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.campusnav.ui.screens.HomeScreen
import com.campusnav.ui.screens.RoomDetailScreen
import com.campusnav.ui.theme.CampusNavTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            CampusNavTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    CampusNavNavigation()
                }
            }
        }
    }
}

@Composable
fun CampusNavNavigation() {
    val navController = rememberNavController()

    NavHost(navController = navController, startDestination = "home") {
        composable("home") {
            HomeScreen(
                onRoomClick = { roomId ->
                    navController.navigate("detail/$roomId")
                }
            )
        }
        composable(
            route = "detail/{roomId}",
            arguments = listOf(navArgument("roomId") { type = NavType.StringType })
        ) { backStackEntry ->
            val roomId = backStackEntry.arguments?.getString("roomId") ?: ""
            RoomDetailScreen(
                roomId = roomId,
                onNavigateUp = { navController.navigateUp() }
            )
        }
    }
}
`,
  },
  {
    name: 'Room.kt',
    path: 'app/src/main/java/com/campusnav/model/Room.kt',
    description: 'Modèle de données Kotlin pour les salles, amphithéâtres et itinéraires',
    code: `package com.campusnav.model

enum class Category(val displayName: String) {
    ALL("Tous"),
    AMPHI("Amphithéâtres"),
    TD("Salles de TD"),
    LABO("Laboratoires"),
    BATIMENT("Bâtiments")
}

data class RouteStep(
    val stepNumber: Int,
    val title: String,
    val instruction: String,
    val landmark: String? = null
)

data class Room(
    val id: String,
    val name: String,
    val code: String,
    val category: Category,
    val building: String,
    val floor: String,
    val floorLevel: Int,
    val capacity: Int,
    val accessInstructions: String,
    val estimatedMinutes: Int,
    val steps: List<RouteStep>,
    val equipment: List<String>,
    val hasAccessibility: Boolean = true
)
`,
  },
  {
    name: 'CampusRepository.kt',
    path: 'app/src/main/java/com/campusnav/data/CampusRepository.kt',
    description: 'Dépôt de données local (client-side) en Kotlin avec les exemples requis',
    code: `package com.campusnav.data

import com.campusnav.model.Category
import com.campusnav.model.Room
import com.campusnav.model.RouteStep
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.map

class CampusRepository {

    // Données d'exemple intégrées en dur (100% local, côté client)
    private val roomsList = listOf(
        Room(
            id = "amphi-a",
            name = "Amphi A",
            code = "AMP-A",
            category = Category.AMPHI,
            building = "Bâtiment Central",
            floor = "Rez-de-chaussée",
            floorLevel = 0,
            capacity = 350,
            accessInstructions = "Prendre l'entrée principale du Bâtiment Central, traverser le hall des pas perdus vers le fond, l'Amphi A se trouve sur la droite face à la cafétéria.",
            estimatedMinutes = 2,
            steps = listOf(
                RouteStep(1, "Entrée Principale", "Passez le hall du Bâtiment Central.", "Hall d'accueil"),
                RouteStep(2, "Traversée du Hall", "Continuez tout droit vers l'atrium central.", "Atrium"),
                RouteStep(3, "Accès Amphi", "Tournez à droite face à la cafétéria, portes de l'Amphi A.", "Portes Amphi A")
            ),
            equipment = listOf("Double Vidéoprojecteur", "Sono sans fil", "Accès PMR", "Climatisation")
        ),
        Room(
            id = "salle-102",
            name = "Salle 102",
            code = "TD-102",
            category = Category.TD,
            building = "Bâtiment Informatique",
            floor = "1er étage",
            floorLevel = 1,
            capacity = 36,
            accessInstructions = "Prendre l'escalier B au niveau de l'aile Ouest, monter au 1er étage, tourner à gauche après l'ascenseur. La salle 102 est la deuxième porte sur votre droite.",
            estimatedMinutes = 3,
            steps = listOf(
                RouteStep(1, "Entrée Ouest", "Entrez par le hall Ouest côté Jardin.", "Hall Ouest"),
                RouteStep(2, "Escalier B", "Montez l'escalier B jusqu'au 1er étage.", "Palier 1er"),
                RouteStep(3, "Couloir Gauche", "Tournez à gauche après l'ascenseur.", "Couloir TD"),
                RouteStep(4, "Salle 102", "Deuxième porte sur la droite.", "Porte 102")
            ),
            equipment = listOf("Tableau interactif", "Prises secteur individuelles", "Wi-Fi Campus")
        ),
        Room(
            id = "labo-chimie",
            name = "Labo Chimie",
            code = "LAB-CHIM",
            category = Category.LABO,
            building = "Bâtiment Sciences",
            floor = "2ème étage",
            floorLevel = 2,
            capacity = 24,
            accessInstructions = "Entrer par le hall Sciences Nord, prendre l'ascenseur jusqu'au 2ème étage (ou l'escalier hélicoïdal C). Suivre le couloir 'Chimie & Matériaux', le laboratoire se situe tout au bout à droite (Porte 208).",
            estimatedMinutes = 4,
            steps = listOf(
                RouteStep(1, "Hall Sciences Nord", "Accédez par le parvis Nord.", "Hall Nord"),
                RouteStep(2, "Ascenseur / Escalier C", "Montez au 2ème étage.", "Niveau 2"),
                RouteStep(3, "Couloir Chimie", "Passez les portes battantes jaunes.", "Aile Chimie"),
                RouteStep(4, "Sas Labo 208", "Tout au bout à droite, sas sécurisé.", "Porte 208")
            ),
            equipment = listOf("Hottes aspirantes", "Douche de sécurité", "Spectrophotomètre", "Blouse requise")
        ),
        Room(
            id = "amphi-turing",
            name = "Amphi Turing",
            code = "AMP-TUR",
            category = Category.AMPHI,
            building = "Bâtiment Informatique",
            floor = "Rez-de-chaussée",
            floorLevel = 0,
            capacity = 200,
            accessInstructions = "Entrée principale du Bâtiment Informatique, face au patio arboré.",
            estimatedMinutes = 1,
            steps = listOf(
                RouteStep(1, "Hall Info", "Entrez par l'accueil Informatique.", "Accueil"),
                RouteStep(2, "Patio", "Contournez le patio végétalisé sur la gauche.", "Patio")
            ),
            equipment = listOf("Vidéoprojecteur Laser", "Micros pupitre", "Accès PMR")
        ),
        Room(
            id = "salle-204",
            name = "Salle 204",
            code = "TD-204",
            category = Category.TD,
            building = "Bâtiment Sciences",
            floor = "1er étage",
            floorLevel = 1,
            capacity = 40,
            accessInstructions = "Monter l'escalier central, tourner immédiatement à droite. Salle 204 au milieu du couloir.",
            estimatedMinutes = 3,
            steps = listOf(
                RouteStep(1, "Escalier Central", "Montez au premier niveau.", "Palier 1"),
                RouteStep(2, "Aile Maths", "Tournez à droite dans le couloir 200.", "Couloir")
            ),
            equipment = listOf("Tableau triptyque", "Vidéoprojecteur")
        ),
        Room(
            id = "bat-central",
            name = "Bâtiment Central",
            code = "BAT-C",
            category = Category.BATIMENT,
            building = "Bâtiment Central",
            floor = "3 niveaux (RDC, 1er, 2ème)",
            floorLevel = 0,
            capacity = 1200,
            accessInstructions = "Au centre du campus, accessible depuis la grande esplanade piétonne.",
            estimatedMinutes = 1,
            steps = listOf(
                RouteStep(1, "Esplanade", "En face de l'arrêt de tramway.", "Arrêt Tram")
            ),
            equipment = listOf("Accueil Général", "Bibliothèque Universitaire", "Scolarité", "Cafétéria")
        )
    )

    private val _rooms = MutableStateFlow(roomsList)
    val rooms = _rooms.asStateFlow()

    fun getRoomById(id: String): Room? {
        return roomsList.find { it.id == id }
    }

    fun searchRooms(query: String, category: Category): List<Room> {
        return roomsList.filter { room ->
            val matchesQuery = query.isBlank() ||
                room.name.contains(query, ignoreCase = true) ||
                room.building.contains(query, ignoreCase = true) ||
                room.floor.contains(query, ignoreCase = true) ||
                room.code.contains(query, ignoreCase = true)

            val matchesCategory = category == Category.ALL || room.category == category

            matchesQuery && matchesCategory
        }
    }
}
`,
  },
  {
    name: 'HomeScreen.kt',
    path: 'app/src/main/java/com/campusnav/ui/screens/HomeScreen.kt',
    description: 'Interface d\'accueil avec Barre de recherche, Filtres par catégories et Liste de cartes MD3',
    code: `package com.campusnav.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.campusnav.data.CampusRepository
import com.campusnav.model.Category
import com.campusnav.model.Room

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    onRoomClick: (String) -> Unit,
    repository: CampusRepository = remember { CampusRepository() }
) {
    var searchQuery by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf(Category.ALL) }

    val filteredRooms = remember(searchQuery, selectedCategory) {
        repository.searchRooms(searchQuery, selectedCategory)
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "CampusNav",
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "Trouvez vos salles & amphithéâtres",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            // 1. Barre de recherche textuelle
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                placeholder = { Text("Rechercher une salle (ex: Amphi A, Salle 102)...") },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.Search,
                        contentDescription = "Rechercher",
                        tint = MaterialTheme.colorScheme.primary
                    )
                },
                trailingIcon = {
                    if (searchQuery.isNotEmpty()) {
                        IconButton(onClick = { searchQuery = "" }) {
                            Icon(
                                imageVector = Icons.Default.Clear,
                                contentDescription = "Effacer"
                            )
                        }
                    }
                },
                shape = RoundedCornerShape(28.dp),
                singleLine = true,
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = MaterialTheme.colorScheme.primary,
                    unfocusedBorderColor = MaterialTheme.colorScheme.outlineVariant
                )
            )

            // Raccourcis de recherche rapide
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState())
                    .padding(horizontal = 16.dp, vertical = 4.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                listOf("Amphi A", "Salle 102", "Labo Chimie").forEach { quickTag ->
                    SuggestionChip(
                        onClick = { searchQuery = quickTag },
                        label = { Text(quickTag) },
                        colors = SuggestionChipDefaults.suggestionChipColors(
                            containerColor = MaterialTheme.colorScheme.surfaceVariant
                        )
                    )
                }
            }

            // 2. Filtres par catégories : 'Amphithéâtres', 'Salles de TD', 'Laboratoires', 'Bâtiments'
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState())
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Category.values().forEach { category ->
                    val isSelected = selectedCategory == category
                    FilterChip(
                        selected = isSelected,
                        onClick = { selectedCategory = category },
                        label = { Text(category.displayName) },
                        leadingIcon = if (isSelected) {
                            {
                                Icon(
                                    imageVector = Icons.Default.Check,
                                    contentDescription = null,
                                    modifier = Modifier.size(16.dp)
                                )
                            }
                        } else null
                    )
                }
            }

            // 3. Cartes cliquables affichant les salles disponibles
            if (filteredRooms.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(32.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "Aucune salle trouvée pour '$searchQuery'",
                        style = MaterialTheme.typography.bodyLarge,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(filteredRooms, key = { it.id }) { room ->
                        RoomCard(
                            room = room,
                            onClick = { onRoomClick(room.id) }
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun RoomCard(
    room: Room,
    onClick: () -> Unit
) {
    ElevatedCard(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.elevatedCardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.elevatedCardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = room.name,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = MaterialTheme.colorScheme.secondaryContainer
                ) {
                    Text(
                        text = room.category.displayName,
                        style = MaterialTheme.typography.labelSmall,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                        color = MaterialTheme.colorScheme.onSecondaryContainer
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.LocationOn,
                    contentDescription = null,
                    modifier = Modifier.size(16.dp),
                    tint = MaterialTheme.colorScheme.outline
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = "\${room.building} • \${room.floor}",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = room.accessInstructions,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                maxLines = 2
            )
        }
    }
}
`,
  },
  {
    name: 'RoomDetailScreen.kt',
    path: 'app/src/main/java/com/campusnav/ui/screens/RoomDetailScreen.kt',
    description: 'Écran de détail d\'une salle : nom, bâtiment, étage, itinéraire textuel pas-à-pas et plan',
    code: `package com.campusnav.ui.screens

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.campusnav.data.CampusRepository
import com.campusnav.model.Room
import com.campusnav.model.RouteStep

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RoomDetailScreen(
    roomId: String,
    onNavigateUp: () -> Unit,
    repository: CampusRepository = remember { CampusRepository() }
) {
    val room = remember(roomId) { repository.getRoomById(roomId) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(room?.name ?: "Détail de la salle") },
                navigationIcon = {
                    IconButton(onClick = onNavigateUp) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Retour"
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        }
    ) { innerPadding ->
        if (room == null) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding),
                contentAlignment = Alignment.Center
            ) {
                Text("Salle introuvable")
            }
        } else {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
                    .verticalScroll(rememberScrollState())
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // En-tête : Nom, Bâtiment, Étage
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.primaryContainer
                    )
                ) {
                    Column(modifier = Modifier.padding(20.dp)) {
                        Text(
                            text = room.name,
                            style = MaterialTheme.typography.headlineMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onPrimaryContainer
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.Place,
                                contentDescription = null,
                                tint = MaterialTheme.colorScheme.primary
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "\${room.building} — \${room.floor}",
                                style = MaterialTheme.typography.titleMedium,
                                color = MaterialTheme.colorScheme.onPrimaryContainer
                            )
                        }
                    }
                }

                // Illustration du Plan d'accès
                Text(
                    text = "Plan d'illustration de l'étage",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold
                )

                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(200.dp)
                        .clip(RoundedCornerShape(16.dp))
                        .background(Color(0xFFF1F5F9))
                ) {
                    Canvas(modifier = Modifier.fillMaxSize()) {
                        // Dessin du plan architectural schématique
                        drawRect(
                            color = Color(0xFFCBD5E1),
                            topLeft = Offset(40f, 40f),
                            size = Size(size.width - 80f, size.height - 80f)
                        )
                        drawRect(
                            color = Color(0xFF2563EB),
                            topLeft = Offset(size.width * 0.5f, 70f),
                            size = Size(120f, 90f)
                        )
                        drawCircle(
                            color = Color(0xFFDC2626),
                            radius = 16f,
                            center = Offset(size.width * 0.5f + 60f, 115f)
                        )
                    }
                    Text(
                        text = "Emplacement : \${room.name} (\${room.floor})",
                        modifier = Modifier
                            .align(Alignment.BottomCenter)
                            .padding(8.dp),
                        style = MaterialTheme.typography.labelMedium,
                        color = Color(0xFF1E293B)
                    )
                }

                // Description textuelle pour s'y rendre
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.surfaceVariant
                    )
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = "Itinéraire & Instructions d'accès",
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = room.accessInstructions,
                            style = MaterialTheme.typography.bodyMedium,
                            lineHeight = MaterialTheme.typography.bodyMedium.lineHeight
                        )
                    }
                }

                // Étapes pas-à-pas
                Text(
                    text = "Étapes du parcours",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold
                )

                room.steps.forEach { step ->
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.Top
                    ) {
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(32.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Text(
                                    text = "\${step.stepNumber}",
                                    color = MaterialTheme.colorScheme.onPrimary,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(
                                text = step.title,
                                fontWeight = FontWeight.SemiBold,
                                style = MaterialTheme.typography.bodyMedium
                            )
                            Text(
                                text = step.instruction,
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
            }
        }
    }
}
`,
  },
  {
    name: 'Theme.kt',
    path: 'app/src/main/java/com/campusnav/ui/theme/Theme.kt',
    description: 'Thème Material Design 3 (bleu, blanc, gris) adapté aux étudiants',
    code: `package com.campusnav.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val BluePrimary = Color(0xFF1E40AF)
val BlueSecondary = Color(0xFF0284C7)
val BlueContainer = Color(0xFFDBEAFE)
val OnBlueContainer = Color(0xFF1E3A8A)
val GrayBackground = Color(0xFFF8FAFC)
val GraySurface = Color(0xFFFFFFFF)
val GrayText = Color(0xFF0F172A)
val GraySubtext = Color(0xFF64748B)

private val LightColorScheme = lightColorScheme(
    primary = BluePrimary,
    onPrimary = Color.White,
    primaryContainer = BlueContainer,
    onPrimaryContainer = OnBlueContainer,
    secondary = BlueSecondary,
    background = GrayBackground,
    surface = GraySurface,
    onBackground = GrayText,
    onSurface = GrayText,
    surfaceVariant = Color(0xFFF1F5F9),
    onSurfaceVariant = GraySubtext
)

@Composable
fun CampusNavTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = LightColorScheme,
        typography = Typography(),
        content = content
    )
}
`,
  },
  {
    name: 'build.gradle.kts',
    path: 'app/build.gradle.kts',
    description: 'Configuration Gradle Android avec Jetpack Compose & Material 3',
    code: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.campusnav"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.campusnav"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.material3)
    implementation(libs.androidx.navigation.compose)
    implementation(libs.androidx.material.icons.extended)
    implementation(libs.androidx.activity.compose)
}
`,
  },
];
