import { useState } from "react";

interface Player {
  name: string;
  isServing: boolean;
}

interface Team {
  name: string;
  score: number;
  players: Player[];
}

interface GameState {
  teams: Team[];
  winningPoints: number;
  winner: number | null;
  currentServiceTeam: number;
  currentServicePlayer: number;
}

// Real Bitmoji character emojis
const BITMOJI_AVATARS = [
  "🧔",
  "👨‍🦰",
  "🧑",
  "👨",
  "👩",
  "👩‍🦱",
  "🧑‍🦲",
  "👨‍🦳",
];

const getRandomBitmoji = () => {
  return BITMOJI_AVATARS[Math.floor(Math.random() * BITMOJI_AVATARS.length)];
};

const Confetti = ({ isActive }: { isActive: boolean }) => {
  if (!isActive) return null;

  const confettis = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.2,
    duration: 2.5 + Math.random() * 0.5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none">
      {confettis.map((conf) => (
        <div
          key={conf.id}
          className="absolute w-2 h-2 rounded-full animate-confetti-fall"
          style={{
            left: `${conf.left}%`,
            top: "-10px",
            backgroundColor: [
              "#D17A3A",
              "#C98050",
              "#D68555",
              "#B85A45",
              "#A04035",
            ][Math.floor(Math.random() * 5)],
            animationDelay: `${conf.delay}s`,
            animationDuration: `${conf.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

const PlayerCard = ({
  player,
  teamColor,
  isServing,
  onClickService,
  bitmoji,
}: {
  player: Player;
  teamColor: "orange" | "red";
  isServing: boolean;
  onClickService: () => void;
  bitmoji: string;
}) => {
  const bgColor = teamColor === "orange" ? "bg-orange-500" : "bg-red-500";
  const glowClass = isServing ? "animate-fire-glow shadow-2xl" : "opacity-70";

  return (
    <div className="flex flex-col items-center gap-2 flex-1">
      <div
        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full ${bgColor} flex items-center justify-center text-4xl sm:text-5xl font-bold cursor-pointer transition-all ${glowClass}`}
        onClick={onClickService}
        title="Click to set as server"
      >
        {bitmoji}
      </div>
      <div className="text-center w-full px-1">
        <p className="font-semibold text-xs sm:text-sm line-clamp-2">{player.name}</p>
        <button
          onClick={onClickService}
          className={`mt-1 px-2 py-0.5 text-xs rounded-full font-medium transition-all ${
            isServing
              ? "bg-orange-500 text-white"
              : "bg-gray-400 text-gray-700"
          }`}
        >
          SERVICE
        </button>
      </div>
    </div>
  );
};

const ScoreBoard = ({
  team,
  teamColor,
  onIncrement,
  onFoul,
  winningPoints,
}: {
  team: Team;
  teamColor: "orange" | "red";
  onIncrement: () => void;
  onFoul: () => void;
  winningPoints: number;
}) => {
  const bgColor = teamColor === "orange" ? "bg-orange-500" : "bg-red-500";
  const isWinning = team.score >= winningPoints;

  return (
    <div className={`${bgColor} rounded-2xl p-4 sm:p-6 text-white flex flex-col items-center gap-3 min-w-max h-fit`}>
      <h3 className="text-lg sm:text-2xl font-bold text-center">{team.name}</h3>
      <div className="text-5xl sm:text-6xl font-bold">{team.score}</div>
      <p className="text-xs sm:text-sm opacity-90">Target: {winningPoints}</p>
      <div className="flex gap-2 w-full">
        <button
          onClick={onIncrement}
          className="flex-1 bg-white text-orange-500 font-bold py-2 sm:py-3 rounded-lg hover:bg-gray-100 transition-all text-lg"
        >
          +1
        </button>
        <button
          onClick={onFoul}
          className="flex-1 bg-white text-red-500 font-bold py-2 sm:py-3 rounded-lg hover:bg-gray-100 transition-all text-lg"
        >
          -1
        </button>
      </div>
      {isWinning && (
        <div className="text-center mt-2">
          <p className="text-sm sm:text-lg font-bold animate-bounce">🏆 WINNING! 🏆</p>
        </div>
      )}
    </div>
  );
};

const WelcomeModal = ({ onSelect }: { onSelect: (count: 2 | 4) => void }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-orange-600 mb-2">
            🏸 Badminton Hub
          </h1>
          <p className="text-gray-600 mb-8">Welcome to your scoring companion!</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => onSelect(2)}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 text-lg"
          >
            👥 2 Players (1v1)
          </button>
          <button
            onClick={() => onSelect(4)}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 text-lg"
          >
            👥👥 4 Players (2v2)
          </button>
        </div>

        <p className="text-center text-gray-500 text-xs mt-6">
          One player per team in 2-player mode, two per team in 4-player mode
        </p>
      </div>
    </div>
  );
};

const SetupModal = ({
  playerCount,
  onStart,
}: {
  playerCount: 2 | 4;
  onStart: (teams: Team[]) => void;
}) => {
  const [teams, setTeams] = useState<Team[]>([
    {
      name: "Team A",
      score: 0,
      players: Array(playerCount === 2 ? 1 : 2)
        .fill(null)
        .map((_, i) => ({ name: `Player ${i + 1}`, isServing: i === 0 })),
    },
    {
      name: "Team B",
      score: 0,
      players: Array(playerCount === 2 ? 1 : 2)
        .fill(null)
        .map((_, i) => ({ name: `Player ${i + 1}`, isServing: false })),
    },
  ]);

  const handleTeamNameChange = (teamIndex: number, name: string) => {
    const newTeams = [...teams];
    newTeams[teamIndex].name = name;
    setTeams(newTeams);
  };

  const handlePlayerNameChange = (
    teamIndex: number,
    playerIndex: number,
    name: string
  ) => {
    const newTeams = [...teams];
    newTeams[teamIndex].players[playerIndex].name = name;
    setTeams(newTeams);
  };

  const handleStart = () => {
    if (
      teams.every((t) => t.name.trim()) &&
      teams.every((t) => t.players.every((p) => p.name.trim()))
    ) {
      onStart(teams);
    } else {
      alert("Please fill in all team and player names");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-orange-600">
          Set Up Your Teams
        </h2>

        <div className="space-y-8">
          {teams.map((team, teamIndex) => (
            <div
              key={teamIndex}
              className={`p-6 rounded-2xl ${
                teamIndex === 0
                  ? "bg-orange-50 border-2 border-orange-400"
                  : "bg-red-50 border-2 border-red-400"
              }`}
            >
              <h3 className="font-bold text-lg mb-4">
                {teamIndex === 0 ? "🟠" : "🔴"} Team Name
              </h3>
              <input
                type="text"
                value={team.name}
                onChange={(e) =>
                  handleTeamNameChange(teamIndex, e.target.value)
                }
                className="w-full border-2 border-gray-300 rounded-lg p-3 mb-6 font-semibold"
                placeholder="Enter team name"
              />

              <h4 className="font-bold text-lg mb-4">Players</h4>
              <div className="space-y-3">
                {team.players.map((player, playerIndex) => (
                  <div key={playerIndex}>
                    <label className="block text-sm font-semibold mb-2">
                      Player {playerIndex + 1}
                    </label>
                    <input
                      type="text"
                      value={player.name}
                      onChange={(e) =>
                        handlePlayerNameChange(
                          teamIndex,
                          playerIndex,
                          e.target.value
                        )
                      }
                      className="w-full border-2 border-gray-300 rounded-lg p-3"
                      placeholder={`Player ${playerIndex + 1} name`}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleStart}
          className="w-full mt-8 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-all text-lg"
        >
          Continue to Winning Points
        </button>
      </div>
    </div>
  );
};

const WinningPointsModal = ({
  onSelect,
}: {
  onSelect: (points: number) => void;
}) => {
  const [custom, setCustom] = useState("");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-orange-600">
          Winning Points
        </h2>

        <p className="text-gray-600 text-center mb-6">
          How many points to win?
        </p>

        <div className="space-y-3 mb-6">
          {[10, 14, 20].map((points) => (
            <button
              key={points}
              onClick={() => onSelect(points)}
              className="w-full bg-gray-100 hover:bg-orange-500 hover:text-white text-gray-800 font-bold py-3 rounded-lg transition-all"
            >
              {points} Points
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="number"
            min="1"
            max="100"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="Custom"
            className="flex-1 border-2 border-gray-300 rounded-lg p-2 text-center"
          />
          <button
            onClick={() => {
              const points = parseInt(custom);
              if (points > 0) onSelect(points);
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 rounded-lg transition-all"
          >
            Set
          </button>
        </div>
      </div>
    </div>
  );
};

const WinnerModal = ({
  winnerTeam,
  onRestart,
}: {
  winnerTeam: Team;
  onRestart: () => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl text-center">
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="text-4xl font-bold mb-4 text-orange-600">
          {winnerTeam.name} Wins!
        </h2>
        <p className="text-gray-600 mb-4 text-lg">
          Final Score: <span className="font-bold">{winnerTeam.score}</span>
        </p>
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">Players:</p>
          <p className="font-semibold">
            {winnerTeam.players.map((p) => p.name).join(" & ")}
          </p>
        </div>

        <button
          onClick={onRestart}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-all text-lg"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default function Index() {
  const [gameMode, setGameMode] = useState<
    "welcome" | "setup" | "winningPoints" | "playing" | "finished"
  >("welcome");
  const [playerCount, setPlayerCount] = useState<2 | 4 | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showWinner, setShowWinner] = useState(false);
  const [playerBitmojis, setPlayerBitmojis] = useState<string[][]>([]);

  const handlePlayerCountSelect = (count: 2 | 4) => {
    setPlayerCount(count);
    setGameMode("setup");
  };

  const handleSetupComplete = (teams: Team[]) => {
    const bitmojis = teams.map((team) =>
      team.players.map(() => getRandomBitmoji())
    );
    setPlayerBitmojis(bitmojis);
    setGameState({
      teams,
      winningPoints: 21,
      winner: null,
      currentServiceTeam: 0,
      currentServicePlayer: 0,
    });
    setGameMode("winningPoints");
  };

  const handleWinningPointsSelect = (points: number) => {
    if (gameState) {
      setGameState({ ...gameState, winningPoints: points });
      setGameMode("playing");
    }
  };

  const handleScoreUpdate = (teamIndex: number, delta: number) => {
    if (!gameState) return;

    const newTeams = gameState.teams.map((t, i) => {
      if (i === teamIndex) {
        return { ...t, score: Math.max(0, t.score + delta) };
      }
      return t;
    });

    const newState = { ...gameState, teams: newTeams };

    const winner = newTeams.findIndex(
      (t) => t.score >= gameState.winningPoints
    );
    if (winner !== -1) {
      newState.winner = winner;
      setShowWinner(true);
      setGameMode("finished");
    }

    setGameState(newState);
  };

  const handleServiceClick = (teamIndex: number, playerIndex: number) => {
    if (!gameState) return;

    const newTeams = gameState.teams.map((team) => ({
      ...team,
      players: team.players.map((p) => ({ ...p, isServing: false })),
    }));

    newTeams[teamIndex].players[playerIndex].isServing = true;

    setGameState({
      ...gameState,
      teams: newTeams,
      currentServiceTeam: teamIndex,
      currentServicePlayer: playerIndex,
    });
  };

  const handleRestart = () => {
    setGameMode("welcome");
    setPlayerCount(null);
    setGameState(null);
    setShowWinner(false);
    setPlayerBitmojis([]);
  };

  const handleExit = () => {
    handleRestart();
  };

  if (gameMode === "welcome") {
    return <WelcomeModal onSelect={handlePlayerCountSelect} />;
  }

  if (gameMode === "setup" && playerCount) {
    return <SetupModal playerCount={playerCount} onStart={handleSetupComplete} />;
  }

  if (gameMode === "winningPoints") {
    return <WinningPointsModal onSelect={handleWinningPointsSelect} />;
  }

  if (!gameState) return null;

  const backgroundStyle = {
    backgroundImage: `linear-gradient(135deg, rgba(220, 120, 40, 0.05) 0%, rgba(200, 90, 60, 0.05) 100%)`,
    backgroundColor: "#F9F5F0",
  };

  return (
    <div
      style={backgroundStyle}
      className="w-screen h-screen flex flex-col overflow-hidden relative"
    >
      <Confetti isActive={showWinner} />

      {/* Header with Exit Button */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="flex-1 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-orange-600">
            🏸 Badminton Hub
          </h1>
        </div>
        <button
          onClick={handleExit}
          className="ml-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm whitespace-nowrap"
        >
          Exit Game
        </button>
      </div>

      {/* Main Game Board - Single Page Layout */}
      <div className="flex-1 flex items-center justify-between px-2 sm:px-4 gap-2 sm:gap-4 overflow-hidden">
        {/* Team 1 - Left Side */}
        <div className="flex-1 flex flex-col items-center justify-center h-full overflow-hidden">
          <div className="flex flex-col gap-3 sm:gap-4 items-center w-full">
            {gameState.teams[0].players.map((player, idx) => (
              <PlayerCard
                key={idx}
                player={player}
                teamColor="orange"
                isServing={
                  gameState.currentServiceTeam === 0 &&
                  gameState.currentServicePlayer === idx
                }
                onClickService={() => handleServiceClick(0, idx)}
                bitmoji={playerBitmojis[0]?.[idx] || getRandomBitmoji()}
              />
            ))}
          </div>
        </div>

        {/* Center - Scoreboards and Info */}
        <div className="flex flex-col items-center justify-center gap-3 sm:gap-6 h-full">
          <div className="text-xs sm:text-sm text-gray-600 font-semibold">
            Winning: {gameState.winningPoints}
          </div>
          <ScoreBoard
            team={gameState.teams[0]}
            teamColor="orange"
            onIncrement={() => handleScoreUpdate(0, 1)}
            onFoul={() => handleScoreUpdate(0, -1)}
            winningPoints={gameState.winningPoints}
          />
          <div className="text-xl sm:text-2xl font-bold text-gray-400">VS</div>
          <ScoreBoard
            team={gameState.teams[1]}
            teamColor="red"
            onIncrement={() => handleScoreUpdate(1, 1)}
            onFoul={() => handleScoreUpdate(1, -1)}
            winningPoints={gameState.winningPoints}
          />
        </div>

        {/* Team 2 - Right Side */}
        <div className="flex-1 flex flex-col items-center justify-center h-full overflow-hidden">
          <div className="flex flex-col gap-3 sm:gap-4 items-center w-full">
            {gameState.teams[1].players.map((player, idx) => (
              <PlayerCard
                key={idx}
                player={player}
                teamColor="red"
                isServing={
                  gameState.currentServiceTeam === 1 &&
                  gameState.currentServicePlayer === idx
                }
                onClickService={() => handleServiceClick(1, idx)}
                bitmoji={playerBitmojis[1]?.[idx] || getRandomBitmoji()}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Winner Modal */}
      {showWinner && gameState.winner !== null && (
        <WinnerModal
          winnerTeam={gameState.teams[gameState.winner]}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
