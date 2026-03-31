import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Heart, Eye, CheckCircle2 } from 'lucide-react';
import { Design } from '../../types';

interface DesignCardProps {
  design: Design;
  onClickDetail?: (designId: string) => void;
  showStats?: boolean;
}

export function DesignCard({
  design,
  onClickDetail,
  showStats = true,
}: DesignCardProps) {
  const handleClick = () => {
    if (onClickDetail) {
      onClickDetail(design.id || design.DESIGN_ID || '');
    }
  };

  const designId = design.id || design.DESIGN_ID;

  return (
    <a
      href={`#design-detail?id=${designId}`}
      onClick={handleClick}
      className="group cursor-pointer bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="relative overflow-hidden aspect-square">
        <ImageWithFallback
          src={
            design.image ||
            design.preview_url ||
            'https://images.unsplash.com/photo-1676134893614-fc13ef156284?w=400'
          }
          alt={design.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button className="bg-[#ca6946] text-white px-6 py-3 rounded-full flex items-center gap-2 transform scale-90 group-hover:scale-100 transition-transform hover:bg-[#b55835]">
            <CheckCircle2 className="w-5 h-5" />
            Use This Design
          </button>
        </div>

        {/* Stats on Hover */}
        {showStats && (
          <div className="absolute top-3 left-3 right-3 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-sm">{design.likes || 0}</span>
            </div>
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span className="text-sm">{design.downloads || 0}</span>
            </div>
          </div>
        )}

        {/* Like Button */}
        <button className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
          <Heart className="w-5 h-5" />
        </button>
      </div>

      {/* Design Info */}
      <div className="p-4">
        <h3 className="font-['Lato'] mb-1 line-clamp-1">{design.name}</h3>
        <p className="text-gray-500 text-sm">by {design.creator || 'Community'}</p>
      </div>
    </a>
  );
}

