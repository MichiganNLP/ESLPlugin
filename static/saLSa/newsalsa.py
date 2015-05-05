"""
 Standalone LexSub Analyzer (SaLSA)
 Ravi S Sinha
 University of North Texas
 Summer 2011
"""

# Imports
import sys
import shelve
from TextBase import *
from InfoBase import InfoBase
from NGrams import NGrams
import string
import nltk
nltk.data.path.append("/home/mazab/nltk_data")

class Salsa:

	def __init__(self, word, sentence):
		sentence = string.replace(sentence, ',' , ' ')
		sentence = string.replace(sentence, '"' , ' ')
		sentence = string.replace(sentence, ';' , ' ')
		sentence = string.replace(sentence, ':' , ' ')
		self.sent = sentence
		self.word = word

		
	def process(self):
		# Step 3: PoS tag the information and store the information
		# Step 4: Get the synonyms from WordNet and Encarta as well as
		#         the inflections from AGID
		# Collected previously for RTLS and AGID, saved as persistent objects
		# synonyms['word']['pos'] = string of synonyms (;)
		# Union of WordNet and Encarta for each head word
		#print self.word
		#print self.sent	
		synonyms = shelve.open('/home/mazab/public_html/salsa_efl/static/saLSa/synonyms.db')['1'] 
		infos = []
		infos.append(InfoBase(self.sent, 1))
		for infoElem in infos:
			infoElem.posTag()
			infoElem.headPos = infoElem.partsOfSpeech[infoElem.positionOfHead][1][:2]
			infoElem.lemmatize()
			if InfoBase.posHash.has_key(infoElem.headPos):
				temp = InfoBase.posHash[infoElem.headPos]
				if synonyms[infoElem.head].has_key(temp):
					infoElem.synonyms = list(set(synonyms[infoElem.head][temp].split(';')))

		inflections = shelve.open('/home/mazab/public_html/salsa_efl/static/saLSa/inflections.db')['1']
		for infoElem in infos:
			pos = InfoBase.posHash[infoElem.headPos]
			for s in infoElem.synonyms:
				if inflections[s].has_key(pos):
					if infoElem.inflections.has_key(s):
						infoElem.inflections[s] += inflections[s][pos]
					else:
						infoElem.inflections[s] = inflections[s][pos]



		# Step 5: Generate all n-grams for all synonyms and their inflections
		for infoElem in infos:
			# Represents all n-grams for this sentence ID
			ngramsCollection = NGrams(infoElem)
			ngramsCollection.constructNGrams()
			ngramsCollection.sanitizeGrammar()
			#infoElem.display()
			#print 'All n-grams = %s\n' % ngramsCollection.ngrams[infoElem.sentenceID]

			
		# Step 6: Get counts, sum the counts, and sort/ reverse-sort them and display
			ngramsCollection.getCounts()
			scores = ngramsCollection.scores[infoElem.sentenceID]
			scores = sorted([(value, key) for (key, value) in scores.items()], reverse = True)
			collect = ""
			for (key, value) in scores:
				collect = collect + str(value) +","
			return collect 
