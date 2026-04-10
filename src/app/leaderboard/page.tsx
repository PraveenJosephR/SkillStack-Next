"use client";

import { useRef, Suspense, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTheme } from "next-themes"
import {
  RoundedBox,
  Text,
  OrbitControls,
  Environment,
} from "@react-three/drei";
import * as THREE from "three";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface Player {
  rank: number;
  username: string;
  gender: "male" | "female";
  totalBet: number;
  lastActivity: string;
  reward: number;
}

const dailyData: Player[] = [
  {
    rank: 1,
    username: "jeniffer",
    gender: "female",
    totalBet: 2677.0,
    lastActivity: "just now",
    reward: 1200,
  },
  {
    rank: 2,
    username: "amanda",
    gender: "female",
    totalBet: 156,
    lastActivity: "5m ago",
    reward: 900,
  },
  {
    rank: 3,
    username: "canes",
    gender: "male",
    totalBet: 1343,
    lastActivity: "12m ago",
    reward: 600,
  },
  {
    rank: 4,
    username: "player",
    gender: "male",
    totalBet: 3432.3,
    lastActivity: "1d ago",
    reward: 900,
  },
  {
    rank: 5,
    username: "pineapple",
    gender: "male",
    totalBet: 2343.53,
    lastActivity: "1d ago",
    reward: 890,
  },
  {
    rank: 6,
    username: "catplayer",
    gender: "female",
    totalBet: 1439.02,
    lastActivity: "1d ago",
    reward: 506,
  },
  {
    rank: 7,
    username: "guild",
    gender: "male",
    totalBet: 980.5,
    lastActivity: "1d ago",
    reward: 470,
  },
];

const monthlyData: Player[] = [
  {
    rank: 1,
    username: "kingsley",
    gender: "male",
    totalBet: 98231,
    lastActivity: "just now",
    reward: 5000,
  },
  {
    rank: 2,
    username: "diana",
    gender: "female",
    totalBet: 72450,
    lastActivity: "2h ago",
    reward: 3500,
  },
  {
    rank: 3,
    username: "rexford",
    gender: "male",
    totalBet: 61100,
    lastActivity: "3h ago",
    reward: 2200,
  },
  {
    rank: 4,
    username: "pineapple",
    gender: "male",
    totalBet: 55234,
    lastActivity: "1d ago",
    reward: 1800,
  },
  {
    rank: 5,
    username: "jeniffer",
    gender: "female",
    totalBet: 49832,
    lastActivity: "1d ago",
    reward: 1400,
  },
  {
    rank: 6,
    username: "catplayer",
    gender: "female",
    totalBet: 34120,
    lastActivity: "2d ago",
    reward: 980,
  },
  {
    rank: 7,
    username: "amanda",
    gender: "female",
    totalBet: 29800,
    lastActivity: "2d ago",
    reward: 750,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBet(value: number): string {
  return value >= 1000
    ? (value / 1000).toFixed(2) + "k"
    : value.toLocaleString("en", { maximumFractionDigits: 2 });
}

function avatarSrc(gender: "male" | "female", username: string) {
  const seed = encodeURIComponent(username);
  return gender === "female"
    ? `https://api.dicebear.com/7.x/lorelei/svg?seed=${seed}&backgroundColor=b6e3f4`
    : `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}&backgroundColor=c0aede`;
}

// ─── Crown SVG ────────────────────────────────────────────────────────────────

function Crown({ color, size = 48 }: { color: string; size?: number }) {
  const id = color.replace("#", "cg");
  const gem =
    color === "#FFD700"
      ? "#FF69B4"
      : color === "#C0C0C0"
        ? "#00CED1"
        : "#FF8C00";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={color} stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <path
        d="M6 34 L8 18 L18 26 L24 10 L30 26 L40 18 L42 34 Z"
        fill={`url(#${id})`}
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <rect
        x="5"
        y="34"
        width="38"
        height="5"
        rx="2"
        fill={color}
        opacity="0.85"
      />
      <circle cx="24" cy="22" r="4" fill={gem} opacity="0.9" />
      <circle cx="24" cy="22" r="2" fill="white" opacity="0.5" />
      <circle cx="8" cy="18" r="2.5" fill={gem} opacity="0.8" />
      <circle cx="40" cy="18" r="2.5" fill={gem} opacity="0.8" />
    </svg>
  );
}

// ─── Badges ───────────────────────────────────────────────────────────────────

function TokenBadge({
  value,
  size = "sm",
}: {
  value: number | string;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 ${size === "md" ? "text-sm" : "text-xs"} font-semibold text-amber-300`}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <circle
          cx="6"
          cy="6"
          r="5.5"
          fill="#F59E0B"
          stroke="#D97706"
          strokeWidth="0.5"
        />
        <text
          x="6"
          y="9"
          textAnchor="middle"
          fontSize="6"
          fill="white"
          fontWeight="bold"
        >
          B
        </text>
      </svg>
      {value}
    </span>
  );
}

function RewardBadge({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 border border-green-500/40 px-2 py-0.5 text-xs font-semibold text-green-300">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <circle
          cx="6"
          cy="6"
          r="5.5"
          fill="#10B981"
          stroke="#059669"
          strokeWidth="0.5"
        />
        <text
          x="6"
          y="9"
          textAnchor="middle"
          fontSize="6"
          fill="white"
          fontWeight="bold"
        >
          T
        </text>
      </svg>
      +{value}
    </span>
  );
}

function LevelBadge() {
  return (
    <Badge className="bg-pink-600 hover:bg-pink-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md border-0">
      24
    </Badge>
  );
}

// ─── 3-D podium configs ───────────────────────────────────────────────────────
//  xPos: left/right offset  |  height: block height  |  yBase: bottom of block

const PODIUM_CFG = [
  {
    label: "1st",
    height: 2.6,
    xPos: 0,
    color: "#601e1e",
    capColor: "#eb2525",
    glowColor: "#f63b3b",
  },
  {
    label: "2nd",
    height: 1.8,
    xPos: -2.3,
    color: "#601e1e",
    capColor: "#d81d1d",
    glowColor: "#fa6060",
  },
  {
    label: "3rd",
    height: 1.2,
    xPos: 2.3,
    color: "#501c1c",
    capColor: "#af1e1e",
    glowColor: "#fd9393",
  },
] as const;

// ─── Single podium mesh ───────────────────────────────────────────────────────

function PodiumMesh({ rankIndex }: { rankIndex: number }) {
  const cfg = PODIUM_CFG[rankIndex];
  const groupRef = useRef<THREE.Group>(null!);
  const FLOOR = -2; // y of the floor plane

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // very gentle float so it feels alive
      groupRef.current.position.y =
        Math.sin(clock.elapsedTime * 0.7 + rankIndex * 1.1) * 0.03;
    }
  });

  const w = 1.9;
  const d = 1.7;
  const yCenter = FLOOR + cfg.height / 2;

  return (
    <group ref={groupRef} position={[cfg.xPos, 0, 0]}>
      {/* Main body */}
      <RoundedBox
        args={[w, cfg.height, d]}
        radius={0.09}
        smoothness={4}
        position={[0, yCenter, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={cfg.color}
          roughness={0.25}
          metalness={0.7}
        />
      </RoundedBox>

      {/* Glowing top cap */}
      <RoundedBox
        args={[w, 0.12, d]}
        radius={0.05}
        smoothness={4}
        position={[0, FLOOR + cfg.height + 0.06, 0]}
      >
        <meshStandardMaterial
          color={cfg.capColor}
          roughness={0.1}
          metalness={0.9}
          emissive={cfg.glowColor}
          emissiveIntensity={0.35}
        />
      </RoundedBox>

      {/* Rank text on front face */}
      <Text
        position={[0, yCenter, d / 2 + 0.02]}
        fontSize={0.52}
        color="rgba(255,255,255,0.1)"
        anchorX="center"
        anchorY="middle"
      >
        {cfg.label}
      </Text>

      {/* Subtle point light at top of each block */}
      <pointLight
        position={[0, FLOOR + cfg.height + 0.5, 0]}
        intensity={0.6}
        distance={3}
        color={cfg.glowColor}
      />
    </group>
  );
}

// ─── Full scene ───────────────────────────────────────────────────────────────

function PodiumScene() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[5, 10, 6]}
        intensity={1.6}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight
        position={[-5, 4, -3]}
        intensity={0.4}
        color="#4488ff"
      />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[20, 14]} />
        <meshStandardMaterial color="#080f24" roughness={0.5} metalness={0.4} />
      </mesh>

      {/* Subtle floor glow ring under 1st place */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.98, 0]}>
        <ringGeometry args={[0.8, 1.4, 64]} />
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#3b82f6"
          emissiveIntensity={0.5}
          transparent
          opacity={0.25}
        />
      </mesh>

      <PodiumMesh rankIndex={0} />
      <PodiumMesh rankIndex={1} />
      <PodiumMesh rankIndex={2} />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2.4}
        minAzimuthAngle={-Math.PI / 5}
        maxAzimuthAngle={Math.PI / 5}
        autoRotate
        autoRotateSpeed={0.4}
      />
    </>
  );
}

// ─── Player info card (HTML overlay above canvas) ─────────────────────────────

// Layout order left→right: 2nd | 1st | 3rd
function PlayerCard({
  player,
  rankIndex,
}: {
  player: Player;
  rankIndex: number;
}) {
  const crownColors = ["#FFD700", "#C0C0C0", "#CD7F32"];
  const crownSizes = [54, 42, 38];
  const isFirst = rankIndex === 0;

  return (
    <div
      className="flex flex-col items-center select-none"
      style={{
        animation: `podiumBounce ${2.6 + rankIndex * 0.4}s ease-in-out infinite`,
      }}
    >
      <Crown color={crownColors[rankIndex]} size={crownSizes[rankIndex]} />

      <div className="relative mt-1 mb-1.5">
        <Avatar
          className={`border-2 shadow-xl ${
            isFirst
              ? "w-16 h-16 border-yellow-400 shadow-yellow-500/40"
              : "border-slate-400/60"
          }`}
          style={isFirst ? {} : { width: 50, height: 50 }}
        >
          <AvatarImage src={avatarSrc(player.gender, player.username)} />
          <AvatarFallback className="bg-slate-700 text-white">
            {player.username[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-1 -left-1">
          <LevelBadge />
        </div>
      </div>

      <p
        className={`text-white font-bold mb-1 ${isFirst ? "text-sm" : "text-xs"}`}
      >
        @{player.username}
      </p>
      <TokenBadge
        value={player.totalBet.toLocaleString()}
        size={isFirst ? "md" : "sm"}
      />
    </div>
  );
}

// ─── Leaderboard page ─────────────────────────────────────────────────────────

export default function Leaderboard() {
  const [tab, setTab] = useState<"daily" | "monthly">("daily");
  const data = tab === "daily" ? dailyData : monthlyData;
  const [isDark, setIsDark] = useState(false)
  const top3 = data.slice(0, 3); // [1st, 2nd, 3rd]
  const rest = data.slice(3);
  const { resolvedTheme } = useTheme()

  useEffect(() => {
  setIsDark(resolvedTheme === "dark")
}, [resolvedTheme])

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center py-10 px-4 gap-6"
      style={{
        background: `
      radial-gradient(circle at 50% -20%, hsl(var(--primary) / 0.25), transparent 60%),
      radial-gradient(circle at 80% 20%, hsl(var(--accent) / 0.15), transparent 60%),
      hsl(var(--background))
    `,
        fontFamily: "'DM Sans', 'Inter', sans-serif",
      }}
    >
      {/* ── Tabs ── */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as "daily" | "monthly")}>
        <TabsList className="bg-[var(--secondary)] dark:bg-[var(--secondary)] border border-[var(--border)] rounded-full p-1">
          <TabsTrigger
            value="daily"
            className="rounded-full px-6 py-1.5 text-sm font-semibold 
                 text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] 
                 data-[state=active]:bg-[var(--primary)] dark:data-[state=active]:bg-[var(--primary)] 
                 data-[state=active]:text-[var(--primary-foreground)] dark:data-[state=active]:text-[var(--primary-foreground)]"
          >
            Daily
          </TabsTrigger>
          <TabsTrigger
            value="monthly"
            className="rounded-full px-6 py-1.5 text-sm font-semibold 
                 text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] 
                 data-[state=active]:bg-[var(--primary)] dark:data-[state=active]:bg-[var(--primary)] 
                 data-[state=active]:text-[var(--primary-foreground)] dark:data-[state=active]:text-[var(--primary-foreground)]"
          >
            Monthly
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* ── Podium area ─────────────────────────────────────────────────── */}
      {/*
        Strategy: Canvas fills the block. We overlay the player info HTML
        on the TOP portion using absolute positioning so the 3D blocks
        appear to be under the avatar/name cards.
      */}
      <div
        className="w-full relative rounded-2xl overflow-hidden"
        style={{ height: 440 }}
      >
        {/* R3F Canvas — the actual 3D scene */}
        <Canvas
          shadows
          camera={{ position: [0, 1.5, 8], fov: 42 }}
          style={{ position: "absolute", inset: 0 }}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            <PodiumScene />
          </Suspense>
        </Canvas>

        {/* HTML overlay: player cards sit above the 3-D blocks */}
        {/* Order: 2nd left | 1st center | 3rd right */}
        <div
          className="absolute inset-x-0 flex justify-center items-start gap-24 px-2"
          style={{ top: 10, bottom: "38%", pointerEvents: "none" }}
        >
          <div className="self-end mb-2">
            <PlayerCard player={top3[1]} rankIndex={1} />
          </div>

          {/* 1st → top aligned */}
          <PlayerCard player={top3[0]} rankIndex={0} />

          {/* 3rd → more lower */}
          <div className="self-end mb-4">
            <PlayerCard player={top3[2]} rankIndex={2} />
          </div>
        </div>
      </div>

      {/* ── Data Table ──────────────────────────────────────────────────── */}
      <div className="w-full">
        <Card
          className="bg-card text-card-foreground
border-border backdrop-blur border rounded-2xl overflow-hidden"
        >
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-muted-foreground text-xs font-semibold uppercase tracking-wider w-16 pl-4">
                    Place
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                    User
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                    Total Bet
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">
                    Last Activity
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs font-semibold uppercase tracking-wider text-right pr-4">
                    Reward
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rest.map((player) => (
                  <TableRow
                    key={player.username}
                    className="border-white/5 hover:hover:bg-accent transition-colors"
                  >
                    <TableCell className="pl-4">
                      <div className="flex items-center gap-1.5">
                        <Trophy className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-slate-300 font-semibold text-sm">
                          {player.rank}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar className="w-8 h-8 border border-white/10">
                          <AvatarImage
                            src={avatarSrc(player.gender, player.username)}
                          />
                          <AvatarFallback className="bg-slate-700 text-white text-xs">
                            {player.username[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-white font-medium text-sm">
                          @{player.username}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <TokenBadge value={formatBet(player.totalBet)} />
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs hidden sm:table-cell">
                      {player.lastActivity}
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <RewardBadge value={player.reward} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <style jsx global>{`
        @keyframes podiumBounce {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </div>
  );
}
