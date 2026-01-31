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
              "#2196F3",
              "#42A5F5",
              "#1976D2",
              "#1565C0",
              "#0D47A1",
            ][Math.floor(Math.random() * 5)],
            animationDelay: `${conf.delay}s`,
            animationDuration: `${conf.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

const AnimatedScore = ({ value }: { value: number }) => {
  const [prevValue, setPrevValue] = useState(value);
  const [animating, setAnimating] = useState(false);

  if (value !== prevValue) {
    setPrevValue(value);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 600);
  }

  return (
    <div
      className={`text-8xl sm:text-9xl font-bold text-blue-600 transition-all ${
        animating ? "animate-score-flip scale-110" : "scale-100"
      }`}
    >
      {value}
    </div>
  );
};

const PlayerCard = ({
  player,
  onClickService,
  isServing,
}: {
  player: Player;
  onClickService: () => void;
  isServing: boolean;
}) => {
  const glowClass = isServing ? "animate-fire-glow shadow-2xl" : "shadow-md";

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <div className="text-center">
        <p className="font-semibold text-base sm:text-lg text-gray-800">
          {player.name}
        </p>
      </div>
      <button
        onClick={onClickService}
        className={`w-32 sm:w-40 px-4 py-3 rounded-lg font-bold text-white transition-all ${glowClass} ${
          isServing
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-blue-400 hover:bg-blue-500"
        }`}
      >
        SERVICE
      </button>
    </div>
  );
};

const TeamSection = ({
  team,
  teamIndex,
  isServing,
  onServiceClick,
  onGoal,
  onFoul,
  winningPoints,
  gameState,
}: {
  team: Team;
  teamIndex: number;
  isServing: (playerIdx: number) => boolean;
  onServiceClick: (playerIdx: number) => void;
  onGoal: () => void;
  onFoul: () => void;
  winningPoints: number;
  gameState: GameState;
}) => {
  const isWinning = team.score >= winningPoints;

  return (
    <div className="flex-1 flex flex-col items-center justify-between h-full py-4 sm:py-8 px-2 sm:px-4 bg-gradient-to-b from-blue-50 to-white">
      {/* Score Section */}
      <div className="flex flex-col items-center gap-3 sm:gap-4">
        <div className="text-2xl sm:text-3xl font-bold text-blue-900">
          {team.name}
        </div>
        <AnimatedScore value={team.score} />
        <div className="text-sm sm:text-base text-gray-600">
          Target: {winningPoints}
        </div>
        {isWinning && (
          <div className="text-lg sm:text-2xl font-bold text-blue-600 animate-bounce">
            🏆 WINNING!
          </div>
        )}
      </div>

      {/* Players Section */}
      <div className="flex flex-col gap-4 sm:gap-6 items-center w-full flex-1 justify-center">
        {team.players.map((player, idx) => (
          <PlayerCard
            key={idx}
            player={player}
            onClickService={() => onServiceClick(idx)}
            isServing={isServing(idx)}
          />
        ))}
      </div>

      {/* Buttons Section */}
      <div className="flex gap-3 sm:gap-4 w-full flex-col sm:flex-row">
        <button
          onClick={onGoal}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 sm:py-4 rounded-lg transition-all text-lg sm:text-xl"
        >
          ⚡ Goal
        </button>
        <button
          onClick={onFoul}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 sm:py-4 rounded-lg transition-all text-lg sm:text-xl"
        >
          ✋ Foul
        </button>
      </div>
    </div>
  );
};

const WelcomeModal = ({ onSelect }: { onSelect: (count: 2 | 4) => void }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            🏸 Badminton Hub
          </h1>
          <p className="text-gray-600 mb-8">
            Welcome to your scoring companion!
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => onSelect(2)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 text-lg"
          >
            👥 2 Players (1v1)
          </button>
          <button
            onClick={() => onSelect(4)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 text-lg"
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
    name: string,
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
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">
          Set Up Your Teams
        </h2>

        <div className="space-y-8">
          {teams.map((team, teamIndex) => (
            <div
              key={teamIndex}
              className={`p-6 rounded-2xl ${
                teamIndex === 0
                  ? "bg-blue-50 border-2 border-blue-400"
                  : "bg-blue-50 border-2 border-blue-300"
              }`}
            >
              <h3 className="font-bold text-lg mb-4 text-blue-900">
                Team {teamIndex === 0 ? "A" : "B"} Name
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

              <h4 className="font-bold text-lg mb-4 text-blue-900">Players</h4>
              <div className="space-y-3">
                {team.players.map((player, playerIndex) => (
                  <div key={playerIndex}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Player {playerIndex + 1}
                    </label>
                    <input
                      type="text"
                      value={player.name}
                      onChange={(e) =>
                        handlePlayerNameChange(
                          teamIndex,
                          playerIndex,
                          e.target.value,
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
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all text-lg"
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
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
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
              className="w-full bg-gray-100 hover:bg-blue-500 hover:text-white text-gray-800 font-bold py-3 rounded-lg transition-all"
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
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 rounded-lg transition-all"
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
        <h2 className="text-4xl font-bold mb-4 text-blue-600">
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all text-lg"
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

  const handlePlayerCountSelect = (count: 2 | 4) => {
    setPlayerCount(count);
    setGameMode("setup");
  };

  const handleSetupComplete = (teams: Team[]) => {
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
        return { ...t, score: t.score + delta };
      }
      return t;
    });

    const newState = { ...gameState, teams: newTeams };

    const winner = newTeams.findIndex(
      (t) => t.score >= gameState.winningPoints,
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
  };

  const handleExit = () => {
    handleRestart();
  };

  if (gameMode === "welcome") {
    return <WelcomeModal onSelect={handlePlayerCountSelect} />;
  }

  if (gameMode === "setup" && playerCount) {
    return (
      <SetupModal playerCount={playerCount} onStart={handleSetupComplete} />
    );
  }

  if (gameMode === "winningPoints") {
    return <WinningPointsModal onSelect={handleWinningPointsSelect} />;
  }

  if (!gameState) return null;

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden bg-gradient-to-br from-blue-100 to-blue-50">
      <Confetti isActive={showWinner} />

      {/* Header with Exit Button */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-blue-600 text-white shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-bold">🏸 Badminton Hub</h1>
        <button
          onClick={handleExit}
          className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm whitespace-nowrap"
        >
          Exit Game
        </button>
      </div>

      {/* Main Game Board - Teams on sides, scoreboard info in middle */}
      <div className="flex-1 flex gap-0 overflow-hidden">
        {/* Team 1 - Left Side */}
        <TeamSection
          team={gameState.teams[0]}
          teamIndex={0}
          isServing={(idx) =>
            gameState.currentServiceTeam === 0 &&
            gameState.currentServicePlayer === idx
          }
          onServiceClick={(idx) => handleServiceClick(0, idx)}
          onGoal={() => handleScoreUpdate(0, 1)}
          onFoul={() => handleScoreUpdate(0, -1)}
          winningPoints={gameState.winningPoints}
          gameState={gameState}
        />

        {/* Team 2 - Right Side */}
        <TeamSection
          team={gameState.teams[1]}
          teamIndex={1}
          isServing={(idx) =>
            gameState.currentServiceTeam === 1 &&
            gameState.currentServicePlayer === idx
          }
          onServiceClick={(idx) => handleServiceClick(1, idx)}
          onGoal={() => handleScoreUpdate(1, 1)}
          onFoul={() => handleScoreUpdate(1, -1)}
          winningPoints={gameState.winningPoints}
          gameState={gameState}
        />
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
