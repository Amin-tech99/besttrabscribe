import React, { useState } from 'react';
import { 
  BookOpenIcon,
  SpeakerWaveIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface GuidelineSection {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  content: {
    overview: string;
    rules: string[];
    examples?: {
      correct: string;
      incorrect: string;
      explanation: string;
    }[];
    tips?: string[];
  };
}

export const Guidelines: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState<string[]>(['transcription-basics']);

  const guidelines: GuidelineSection[] = [
    {
      id: 'transcription-basics',
      title: 'Transcription Basics',
      icon: DocumentTextIcon,
      content: {
        overview: 'Fundamental principles for accurate Hassaniya Arabic transcription.',
        rules: [
          'Transcribe exactly what is spoken, including hesitations and repetitions',
          'Use standard Arabic script with proper diacritics when necessary',
          'Maintain speaker identification when multiple speakers are present',
          'Include timestamps for significant pauses (longer than 3 seconds)',
          'Preserve the dialectal features specific to Hassaniya Arabic'
        ],
        examples: [
          {
            correct: 'أنا... أنا كنت نمشي للسوق',
            incorrect: 'أنا كنت أمشي إلى السوق',
            explanation: 'Keep hesitations and dialectal verb forms as spoken'
          },
          {
            correct: '[المتحدث 1]: كيف راك؟ [المتحدث 2]: الحمد لله',
            incorrect: 'كيف راك؟ الحمد لله',
            explanation: 'Always identify different speakers clearly'
          }
        ],
        tips: [
          'Listen to the entire segment before starting transcription',
          'Use headphones for better audio clarity',
          'Take breaks every 30 minutes to maintain accuracy',
          'Double-check proper nouns and place names'
        ]
      }
    },
    {
      id: 'audio-quality',
      title: 'Audio Quality Guidelines',
      icon: SpeakerWaveIcon,
      content: {
        overview: 'How to handle different audio quality scenarios and technical issues.',
        rules: [
          'Mark unclear audio sections with [غير واضح] (unclear)',
          'Use [ضوضاء] for background noise that interferes with speech',
          'Indicate overlapping speech with [تداخل في الكلام]',
          'Mark inaudible sections with [غير مسموع] and timestamp',
          'Report technical issues that prevent accurate transcription'
        ],
        examples: [
          {
            correct: 'كان يقول [غير واضح 00:15-00:18] وبعدين راح',
            incorrect: 'كان يقول شيء وبعدين راح',
            explanation: 'Mark unclear sections with timestamps rather than guessing'
          },
          {
            correct: '[ضوضاء] المتحدث: نعم أوافق على [تداخل في الكلام]',
            incorrect: 'نعم أوافق على الاقتراح',
            explanation: 'Indicate audio issues rather than filling in gaps'
          }
        ],
        tips: [
          'Adjust playback speed for difficult sections',
          'Use audio enhancement tools when available',
          'Mark recurring audio issues for technical review',
          'Prioritize accuracy over speed when audio is challenging'
        ]
      }
    },
    {
      id: 'dialectal-features',
      title: 'Hassaniya Dialectal Features',
      icon: BookOpenIcon,
      content: {
        overview: 'Specific guidelines for preserving Hassaniya Arabic linguistic features.',
        rules: [
          'Preserve unique Hassaniya vocabulary and expressions',
          'Maintain characteristic pronunciation patterns in transcription',
          'Use appropriate script variations for Hassaniya-specific sounds',
          'Keep code-switching between Arabic, French, and local languages',
          'Preserve traditional greetings and cultural expressions'
        ],
        examples: [
          {
            correct: 'أشنو راك دايرة؟',
            incorrect: 'ماذا تفعلين؟',
            explanation: 'Keep Hassaniya question forms rather than standard Arabic'
          },
          {
            correct: 'نروح للمارشي نشري خضرة',
            incorrect: 'أذهب إلى السوق لأشتري خضروات',
            explanation: 'Preserve French loanwords (marché) and dialectal vocabulary'
          }
        ],
        tips: [
          'Familiarize yourself with common Hassaniya expressions',
          'Consult the dialectal dictionary for unfamiliar terms',
          'Ask for clarification on regional variations',
          'Note cultural context that affects meaning'
        ]
      }
    },
    {
      id: 'formatting-standards',
      title: 'Formatting Standards',
      icon: DocumentTextIcon,
      content: {
        overview: 'Consistent formatting rules for professional transcription output.',
        rules: [
          'Use proper punctuation following Arabic writing conventions',
          'Start new paragraphs for topic changes or new speakers',
          'Use square brackets for transcriber notes and clarifications',
          'Apply consistent spacing and line breaks',
          'Include metadata tags for special content (songs, prayers, etc.)'
        ],
        examples: [
          {
            correct: '[المتحدث 1]: السلام عليكم.\n[المتحدث 2]: وعليكم السلام.',
            incorrect: 'المتحدث 1 السلام عليكم المتحدث 2 وعليكم السلام',
            explanation: 'Use proper line breaks and speaker identification'
          },
          {
            correct: '[أغنية تراثية] يا ليل يا عين... [نهاية الأغنية]',
            incorrect: 'يا ليل يا عين...',
            explanation: 'Tag special content types for context'
          }
        ],
        tips: [
          'Use consistent formatting throughout the document',
          'Check for proper Arabic text direction',
          'Maintain professional appearance',
          'Follow project-specific style guidelines'
        ]
      }
    },
    {
      id: 'quality-control',
      title: 'Quality Control',
      icon: CheckCircleIcon,
      content: {
        overview: 'Self-review and quality assurance practices for transcription work.',
        rules: [
          'Review your work before submission',
          'Check for spelling and grammatical accuracy',
          'Verify proper names and technical terms',
          'Ensure consistency in speaker identification',
          'Confirm all unclear sections are properly marked'
        ],
        examples: [
          {
            correct: 'Final review shows consistent speaker tags and proper dialectal preservation',
            incorrect: 'Quick submission without review',
            explanation: 'Always perform quality checks before submission'
          }
        ],
        tips: [
          'Read through the entire transcription once completed',
          'Use spell-check tools for Arabic text',
          'Cross-reference difficult terms with reliable sources',
          'Take a break before final review for fresh perspective'
        ]
      }
    },
    {
      id: 'common-mistakes',
      title: 'Common Mistakes to Avoid',
      icon: ExclamationTriangleIcon,
      content: {
        overview: 'Frequent errors in Hassaniya transcription and how to avoid them.',
        rules: [
          'Do not standardize dialectal speech into Modern Standard Arabic',
          'Avoid adding words or phrases not actually spoken',
          'Do not correct speaker grammar or pronunciation',
          'Avoid inconsistent transliteration of proper names',
          'Do not ignore cultural context and idiomatic expressions'
        ],
        examples: [
          {
            correct: 'كنت نقول ليك',
            incorrect: 'كنت أقول لك',
            explanation: 'Keep dialectal pronoun forms, do not standardize'
          },
          {
            correct: '[غير واضح]',
            incorrect: 'شيء ما',
            explanation: 'Mark unclear sections rather than guessing content'
          }
        ],
        tips: [
          'When in doubt, preserve the original dialectal form',
          'Ask supervisors about unfamiliar expressions',
          'Maintain objectivity in transcription',
          'Focus on accuracy over perceived correctness'
        ]
      }
    }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const filteredGuidelines = guidelines.filter(guideline =>
    guideline.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guideline.content.overview.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guideline.content.rules.some(rule => rule.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const ExampleCard: React.FC<{
    example: { correct: string; incorrect: string; explanation: string };
    index: number;
  }> = ({ example, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-gray-50 rounded-card p-4 space-y-3"
    >
      <div className="space-y-2">
        <div className="flex items-start space-x-2">
          <CheckCircleIcon className="h-4 w-4 text-accent-green mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700 mb-1">Correct:</p>
            <p className="text-sm text-gray-900 font-arabic">{example.correct}</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-2">
          <XCircleIcon className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700 mb-1">Incorrect:</p>
            <p className="text-sm text-gray-900 font-arabic">{example.incorrect}</p>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-2">
        <p className="text-xs text-gray-600">
          <strong>Explanation:</strong> {example.explanation}
        </p>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-title-mobile sm:text-title text-primary-900 mb-2">
          Transcription Guidelines
        </h1>
        <p className="text-secondary text-gray-600">
          Comprehensive guidelines for accurate Hassaniya Arabic transcription
        </p>
      </motion.div>

      {/* Search */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search guidelines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </motion.div>

      {/* Guidelines Sections */}
      <div className="space-y-4">
        {filteredGuidelines.map((guideline, index) => {
          const isExpanded = expandedSections.includes(guideline.id);
          const Icon = guideline.icon;
          
          return (
            <motion.div
              key={guideline.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="card overflow-hidden"
            >
              {/* Section Header */}
              <button
                onClick={() => toggleSection(guideline.id)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors touch-target"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-accent-blue bg-opacity-10 rounded-card flex items-center justify-center">
                      <Icon className="h-5 w-5 text-accent-blue" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-primary-900">
                      {guideline.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {guideline.content.overview}
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {isExpanded ? (
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Section Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-200"
                  >
                    <div className="p-6 space-y-6">
                      {/* Rules */}
                      <div>
                        <h4 className="text-md font-semibold text-primary-900 mb-3">
                          Key Rules
                        </h4>
                        <ul className="space-y-2">
                          {guideline.content.rules.map((rule, ruleIndex) => (
                            <motion.li
                              key={ruleIndex}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: ruleIndex * 0.05 }}
                              className="flex items-start space-x-2"
                            >
                              <div className="w-1.5 h-1.5 bg-accent-blue rounded-full mt-2 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{rule}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                      {/* Examples */}
                      {guideline.content.examples && (
                        <div>
                          <h4 className="text-md font-semibold text-primary-900 mb-3">
                            Examples
                          </h4>
                          <div className="space-y-3">
                            {guideline.content.examples.map((example, exampleIndex) => (
                              <ExampleCard
                                key={exampleIndex}
                                example={example}
                                index={exampleIndex}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tips */}
                      {guideline.content.tips && (
                        <div>
                          <h4 className="text-md font-semibold text-primary-900 mb-3">
                            Pro Tips
                          </h4>
                          <div className="bg-accent-amber bg-opacity-10 rounded-card p-4">
                            <ul className="space-y-2">
                              {guideline.content.tips.map((tip, tipIndex) => (
                                <motion.li
                                  key={tipIndex}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: tipIndex * 0.05 }}
                                  className="flex items-start space-x-2"
                                >
                                  <div className="w-1.5 h-1.5 bg-accent-amber rounded-full mt-2 flex-shrink-0" />
                                  <span className="text-sm text-gray-700">{tip}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* No Results */}
      {filteredGuidelines.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No guidelines found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search terms.
          </p>
        </motion.div>
      )}
    </div>
  );
};