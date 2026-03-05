import { Tool } from '../types';

interface ToolCardProps {
  tool: Tool;
  onClick: () => void;
}

export default function ToolCard({ tool, onClick }: ToolCardProps) {
  return (
    <button
      onClick={onClick}
      className="group bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-6 text-left transition-all duration-300 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1"
    >
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        <tool.icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="text-lg font-bold text-neutral-100 mb-1 group-hover:text-amber-400 transition-colors">
        {tool.name}
      </h3>
      <p className="text-sm text-neutral-400">{tool.desc}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className={`text-xs px-2 py-1 rounded-full ${
          tool.category === 'P0' ? 'bg-red-500/20 text-red-400' :
          tool.category === 'P1' ? 'bg-amber-500/20 text-amber-400' :
          'bg-green-500/20 text-green-400'
        }`}>
          {tool.category}
        </span>
        <span className="text-xs text-neutral-500 group-hover:text-amber-400 transition-colors flex items-center gap-1">
          立即体验 →
        </span>
      </div>
    </button>
  );
}
