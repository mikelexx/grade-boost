"use client";
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ResultsPageNavBar from '@/components/ResultsPageNavBar';
import SearchResultCard from '@/components/SearchResultCard';
import FileService from '../../../services/firebaseFile';
import { FileMaterial } from '@/types/FileMaterial';

function ResultsPageComponent() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<FileMaterial[]>([]);
  const [filteredResults, setFilteredResults] = useState<FileMaterial[]>([]);
  const [loading, setLoading] = useState(false);
  const [displayedQuery, setDisplayedQuery] = useState('');
  const [materialCounts, setMaterialCounts] = useState({
    assignments: 0,
    notes: 0,
    solutions: 0,
    pastPapers: 0,
  });
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  useEffect(() => {
    const query = searchParams.get('page');
    const category = searchParams.get('category');

    if (query) {
      handleSearch(query);
    }
    if (category) {
      handleCategorySearch(category);
    }
  }, [searchParams]);

  useEffect(() => {
    const countMaterialsByType = () => {
      const counts = results.reduce(
        (acc, result) => {
          if (result.materialType === 'past-papers') acc.pastPapers++;
          else if (result.materialType === 'assignment') acc.assignments++;
          else if (result.materialType === 'notes') acc.notes++;
          else if (result.materialType === 'solutions') acc.solutions++;
          return acc;
        },
        { pastPapers: 0, assignments: 0, notes: 0, solutions: 0 }
      );
      setMaterialCounts(counts);
    };
    countMaterialsByType();
  }, [results]);

  const handleCategorySearch = async (category: string) => {
    setDisplayedQuery(category);
    setLoading(true);
    try {
      const searchResults = await FileService.searchFilesByCategory(category);
      setResults(searchResults);
      setFilteredResults(searchResults); // Initialize with all results
    } catch (error) {
      console.error('Error fetching category search results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setDisplayedQuery(query);
    setLoading(true);
    try {
      const searchResults = await FileService.searchMaterials(query);
      setResults(searchResults as FileMaterial[]);
      setFilteredResults(searchResults as FileMaterial[]);
    } catch (error) {
      console.error('Error searching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (type: string) => {
    const updatedSelectedTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];

    setSelectedTypes(updatedSelectedTypes);

    if (updatedSelectedTypes.length > 0) {
      const filtered = results.filter((result) =>
        updatedSelectedTypes.includes(result.materialType)
      );
      setFilteredResults(filtered);
    } else {
      setFilteredResults(results); // Show all if no checkbox selected
    }
  };

  return (
	  <>
      <ResultsPageNavBar onSearch={handleSearch} />
      <div className="flex-col pt-16 bg-white p-6">
        <h1 className="break-words text-center text-2xl md:text-3xl font-semibold mb-6">
          {loading ? 'Searching for ' : 'Results for '} &apos;{displayedQuery}&apos;
        </h1>
        <div className="flex gap-6 bg-white">
          <aside className="sticky top-20 w-full md:w-1/4 p-6 mb-auto border border-black border-opacity-20">
            <h3 className="text-xl font-semibold mb-4">Material Types</h3>
            <div>
              <label className="flex justify-between items-center py-2 w-full flex-wrap">
                <span>Past Papers ({materialCounts.pastPapers})</span>
                <input
                  type="checkbox"
                  checked={selectedTypes.includes('past-papers')}
                  onChange={() => handleCheckboxChange('past-papers')}
                />
              </label>
              <label className="flex justify-between items-center py-2 w-full flex-wrap">
                <span>Assignments ({materialCounts.assignments})</span>
                <input
                  type="checkbox"
                  checked={selectedTypes.includes('assignment')}
                  onChange={() => handleCheckboxChange('assignment')}
                />
              </label>
              <label className="flex justify-between items-center py-2 w-full flex-wrap">
                <span>Notes ({materialCounts.notes})</span>
                <input
                  type="checkbox"
                  checked={selectedTypes.includes('notes')}
                  onChange={() => handleCheckboxChange('notes')}
                />
              </label>
              <label className="flex justify-between items-center py-2 w-full flex-wrap">
                <span>Solutions ({materialCounts.solutions})</span>
                <input
                  type="checkbox"
                  checked={selectedTypes.includes('solutions')}
                  onChange={() => handleCheckboxChange('solutions')}
                />
              </label>
            </div>
          </aside>

          <section className="w-3/4 h-full min-h-screen overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
              </div>
            ) : filteredResults.length > 0 ? (
              filteredResults.map((result) => (
                <SearchResultCard key={result.id} result={result} />
              ))
            ) : (
              <div className="h-96 flex flex-col items-center justify-center">
                <p className="text-2xl font-semibold text-gray-500 mb-4">No results found</p>
                <p className="text-gray-400">Try a different search or check your spelling.</p>
              </div>
            )}
          </section>
        </div>
      </div>
      </>
  );
}
export default function ResultsPage(){
	return <Suspense fallback={<p>Loading...</p>}>
	<ResultsPageComponent/>
    </Suspense>
}
