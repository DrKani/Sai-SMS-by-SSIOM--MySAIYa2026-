import React from 'react';
import { Search, Clock, TrendingUp, Command } from 'lucide-react';
import { ChevronRight } from 'lucide-react';

interface SearchResult {
    title: string;
    link: string;
    category?: string;
    subLabel?: string;
    snippet?: string;
    icon?: React.ReactNode;
    color?: string;
}

interface EnhancedSearchBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    isSearchOpen: boolean;
    setIsSearchOpen: (open: boolean) => void;
    searchResults: SearchResult[];
    onSelect: (link: string) => void;
    placeholder?: string;
}

const EnhancedSearchBar: React.FC<EnhancedSearchBarProps> = ({
    searchQuery,
    setSearchQuery,
    isSearchOpen,
    setIsSearchOpen,
    searchResults,
    onSelect,
    placeholder = 'Search resources...'
}) => {
    const searchRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const [recentSearches, setRecentSearches] = React.useState<string[]>(() => {
        const saved = localStorage.getItem('sms_recent_searches');
        return saved ? JSON.parse(saved) : [];
    });

    const suggestedPages = [
        { title: 'Namasmarana Tracker', link: '/namasmarana', icon: '🎤' },
        { title: 'Book Club', link: '/book-club', icon: '📚' },
        { title: 'Dashboard', link: '/dashboard', icon: '📊' },
        { title: 'Games & Puzzles', link: '/games', icon: '🎮' },
    ];

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            // Cmd+K or Ctrl+K to focus search
            if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
                event.preventDefault();
                inputRef.current?.focus();
                setIsSearchOpen(true);
            }
            // Escape to close
            if (event.key === 'Escape') {
                setIsSearchOpen(false);
                inputRef.current?.blur();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [setIsSearchOpen]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setIsSearchOpen(true);

        // Save to recent searches if not empty
        if (query.trim() && query.length >= 2) {
            const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
            setRecentSearches(updated);
            localStorage.setItem('sms_recent_searches', JSON.stringify(updated));
        }
    };

    const handleSelectResult = (link: string, title?: string) => {
        if (title && searchQuery.trim()) {
            const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
            setRecentSearches(updated);
            localStorage.setItem('sms_recent_searches', JSON.stringify(updated));
        }
        onSelect(link);
    };

    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem('sms_recent_searches');
    };

    // Group results by category
    const groupedResults = searchResults.reduce((acc: any, result: any) => {
        const category = result.category || 'Other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(result);
        return acc;
    }, {});

    const showDropdown = isSearchOpen;
    const hasQuery = searchQuery.length >= 2;

    return (
        <div ref={searchRef} className="flex-grow max-w-xl relative">
            <div className="relative group">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder={placeholder}
                    className={`w-full py-2.5 pl-11 pr-24 rounded-2xl border transition-all text-xs font-bold outline-none ${isSearchOpen
                            ? 'bg-white border-gold-500 shadow-xl'
                            : 'bg-neutral-50 border-navy-50 group-hover:bg-white group-hover:border-navy-100'
                        }`}
                    value={searchQuery}
                    onFocus={() => setIsSearchOpen(true)}
                    onChange={e => handleSearch(e.target.value)}
                />
                <Search
                    className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isSearchOpen ? 'text-gold-500' : 'text-navy-200'
                        }`}
                    size={16}
                />
                {/* Keyboard shortcut hint */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-navy-300">
                    <Command size={12} strokeWidth={2.5} />
                    <span className="text-[10px] font-black">K</span>
                </div>
            </div>

            {/* Enhanced Dropdown with Recent Searches and Suggestions */}
            {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl shadow-2xl border border-navy-50 overflow-hidden z-[120] max-h-[70vh] flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
                    {!hasQuery ? (
                        // Show recent searches and suggestions when no query
                        <div className="p-4 space-y-6">
                            {/* Recent Searches */}
                            {recentSearches.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2 text-navy-400">
                                            <Clock size={14} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">
                                                Recent Searches
                                            </span>
                                        </div>
                                        <button
                                            onClick={clearRecentSearches}
                                            className="text-[9px] font-bold uppercase tracking-wider text-navy-300 hover:text-red-600 transition-colors"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                    <div className="space-y-1">
                                        {recentSearches.map((search, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setSearchQuery(search);
                                                    inputRef.current?.focus();
                                                }}
                                                className="w-full text-left px-4 py-2 rounded-xl hover:bg-neutral-50 text-sm text-navy-700 transition-colors"
                                            >
                                                {search}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Suggested Pages */}
                            <div>
                                <div className="flex items-center gap-2 text-navy-400 mb-3">
                                    <TrendingUp size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                        Quick Access
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    {suggestedPages.map((page, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSelectResult(page.link)}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-neutral-50 transition-colors group"
                                        >
                                            <span className="text-xl">{page.icon}</span>
                                            <span className="text-sm font-semibold text-navy-900 group-hover:text-purple-600 transition-colors">
                                                {page.title}
                                            </span>
                                            <ChevronRight size={14} className="ml-auto text-navy-100 group-hover:text-navy-900" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Keyboard shortcuts info */}
                            <div className="pt-4 border-t border-navy-50">
                                <div className="flex items-center justify-center gap-6 text-[10px] text-navy-300">
                                    <div className="flex items-center gap-2">
                                        <kbd className="px-2 py-1 bg-neutral-100 rounded text-[9px] font-bold border border-navy-100">
                                            <Command size={10} className="inline" /> K
                                        </kbd>
                                        <span>to open</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <kbd className="px-2 py-1 bg-neutral-100 rounded text-[9px] font-bold border border-navy-100">
                                            ESC
                                        </kbd>
                                        <span>to close</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Show search results when there's a query
                        <>
                            <div className="p-4 bg-neutral-50 border-b border-navy-50 shrink-0">
                                <span className="text-[10px] font-black uppercase tracking-widest text-navy-300">
                                    Search Results for "{searchQuery}" • {searchResults.length}{' '}
                                    {searchResults.length === 1 ? 'match' : 'matches'}
                                </span>
                            </div>
                            <div className="overflow-y-auto custom-scrollbar p-2 space-y-1">
                                {searchResults.length === 0 ? (
                                    <div className="p-8 text-center space-y-2">
                                        <p className="text-navy-200 italic text-sm">
                                            No matches found in the 2026 registry.
                                        </p>
                                        <p className="text-navy-300 text-xs">
                                            Try searching for: Book Club, Namasmarana, Events, Dashboard
                                        </p>
                                    </div>
                                ) : (
                                    Object.entries(groupedResults).map(([category, categoryResults]: [string, any]) => (
                                        <div key={category} className="mb-3">
                                            <div className="px-4 py-2 text-[8px] font-black uppercase tracking-widest text-gold-600 bg-gold-50/30 rounded-xl mb-1">
                                                {category}
                                            </div>
                                            {categoryResults.map((res: any, idx: number) => (
                                                <button
                                                    key={`${res.type}-${idx}`}
                                                    onClick={() => handleSelectResult(res.link, res.title)}
                                                    className="w-full text-left p-4 rounded-2xl hover:bg-neutral-50 flex items-center gap-4 group transition-all"
                                                >
                                                    <div
                                                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${res.color || 'bg-navy-50 text-navy-500'
                                                            }`}
                                                    >
                                                        {res.icon}
                                                    </div>
                                                    <div className="flex-grow">
                                                        <div className="flex justify-between items-center mb-0.5">
                                                            {res.subLabel && (
                                                                <span className="text-[8px] font-bold text-navy-200">
                                                                    {res.subLabel}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <h4 className="text-sm font-bold text-navy-900 group-hover:text-purple-600 transition-colors">
                                                            {res.title}
                                                        </h4>
                                                        {res.snippet && (
                                                            <p className="text-[10px] text-navy-400 line-clamp-1 mt-1">
                                                                {res.snippet}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <ChevronRight size={14} className="text-navy-100 group-hover:text-navy-900" />
                                                </button>
                                            ))}
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default EnhancedSearchBar;
