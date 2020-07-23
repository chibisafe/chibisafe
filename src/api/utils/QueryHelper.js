const chrono = require('chrono-node');

class QueryHelper {
	static parsers = {
		before: (val) => QueryHelper.parseChronoList(val),
		after: (val) => QueryHelper.parseChronoList(val),
		tag: (val) => QueryHelper.sanitizeTags(val),
	};

	static requirementHandlers = {
		album: (knex) => knex
			.join('albumsFiles', 'files.id', '=', 'albumsFiles.fileId')
			.join('albums', 'albumsFiles.albumId', '=', 'album.id'),
		tag: (knex) => knex
			.join('fileTags', 'files.id', '=', 'fileTags.fileId')
			.join('tags', 'fileTags.tagId', '=', 'tags.id'),
	}

	static fieldToSQLMapping = {
		album: 'albums.name',
		tag: 'tags.name',
		before: 'files.createdAt',
		after: 'files.createdAt',
	}

	static handlers = {
		album({ db, knex }, list) {
			return QueryHelper.generateInclusionForAlbums(db, knex, list);
		},
		tag({ db, knex }, list) {
			list = QueryHelper.parsers.tag(list);
			return QueryHelper.generateInclusionForTags(db, knex, list);
		},
		before({ knex }, list) {
			list = QueryHelper.parsers.before(list);
			return QueryHelper.generateBefore(knex, 'before', list);
		},
		after({ knex }, list) {
			list = QueryHelper.parsers.after(list);
			return QueryHelper.generateAfter(knex, 'after', list);
		},
		file({ knex }, list) {
			return QueryHelper.generateLike(knex, 'name', list);
		},
		exclude({ db, knex }, dict) {
			for (const [key, value] of Object.entries(dict)) {
				if (key === 'album') {
					knex = QueryHelper.generateExclusionForAlbums(db, knex, value);
				}
				if (key === 'tag') {
					const parsed = QueryHelper.parsers.tag(value);
					knex = QueryHelper.generateExclusionForTags(db, knex, parsed);
				}
			}
			return knex;
		},
	}

	static verify(field, list) {
		if (!Array.isArray(list)) {
			throw new Error(`Expected Array got ${typeof list}`);
		}
		if (typeof field !== 'string') {
			throw new Error(`Expected string got ${typeof field}`);
		}
		return true;
	}

	static getMapping(field) {
		if (!QueryHelper.fieldToSQLMapping[field]) {
			throw new Error(`No SQL mapping for ${field} field found`);
		}

		return QueryHelper.fieldToSQLMapping[field];
	}

	static generateIn(knex, field, list) {
		QueryHelper.verify(field, list);
		return knex.whereIn(QueryHelper.getMapping(field), list);
	}

	static generateNotIn(knex, field, list) {
		QueryHelper.verify(field, list);
		return knex.whereNotExists(QueryHelper.getMapping(field), list);
	}

	static generateBefore(knex, field, list) {
		QueryHelper.verify(field, list);
	}

	static generateAfter(knex, field, list) {
		QueryHelper.verify(field, list);
	}

	static parseChronoList(list) {
		return list.map((e) => chrono.parse(e));
	}

	static sanitizeTags(list) {
		return list.map((e) => e.replace(/\s/g, '_'));
	}

	static generateInclusionForTags(db, knex, list) {
		const subQ = db.table('fileTags')
			.select('fileTags.fileId')
			.join('tags', 'fileTags.tagId', '=', 'tags.id')
			.where('fileTags.fileId', db.ref('files.id'))
			.whereIn('tags.name', list)
			.groupBy('fileTags.fileId')
			.havingRaw('count(distinct tags.name) = ?', [list.length]);

		return knex.whereIn('files.id', subQ);
	}

	static generateInclusionForAlbums(db, knex, list) {
		const subQ = db.table('albumsFiles')
			.select('albumsFiles.fileId')
			.join('albums', 'albumsFiles.albumId', '=', 'albums.id')
			.where('albumsFiles.fileId', db.ref('files.id'))
			.whereIn('albums.name', list)
			.groupBy('albumsFiles.fileId')
			.havingRaw('count(distinct albums.name) = ?', [list.length]);

		return knex.whereIn('files.id', subQ);
	}

	static generateExclusionForTags(db, knex, list) {
		const subQ = db.table('fileTags')
			.select('fileTags.fileId')
			.join('tags', 'fileTags.tagId', '=', 'tags.id')
			.where('fileTags.fileId', db.ref('files.id'))
			.whereIn('tags.name', list);

		return knex.whereNotIn('files.id', subQ);
	}

	static generateExclusionForAlbums(db, knex, list) {
		const subQ = db.table('albumsFiles')
			.select('albumsFiles.fileId')
			.join('albums', 'albumsFiles.albumId', '=', 'albums.id')
			.where('albumsFiles.fileId', db.ref('files.id'))
			.whereIn('albums.name', list);

		return knex.whereNotIn('files.id', subQ);
	}

	static generateLike(knex, field, list) {
		for (const str of list) {
			knex = knex.where(field, 'like', `${str}%`);
		}

		return knex;
	}

	static loadRequirements(knex, queryObject) {
		// sanity check so we don't accidentally require the same thing twice
		const loadedRequirements = [];

		for (const key of Object.keys(queryObject)) {
			if (QueryHelper.requirementHandlers[key] && loadedRequirements.indexOf(key) === -1) {
				knex = QueryHelper.requirementHandlers[key](knex);
				loadedRequirements.push(key);
			}
		}

		return knex;
	}

	static mergeTextWithTags(queryObject) {
		if (queryObject.text) {
			let { text } = queryObject;
			if (!Array.isArray(text)) { text = [text]; }

			queryObject.tag = [...(queryObject.tag || []), ...text];
		}

		if (queryObject.exclude && queryObject.exclude.text) {
			let { text } = queryObject.exclude;
			if (!Array.isArray(text)) { text = [text]; }

			queryObject.exclude.tag = [...(queryObject.exclude.tag || []), ...text];
		}

		return queryObject;
	}

	static processQuery(db, knex, queryObject) {
		queryObject = QueryHelper.mergeTextWithTags(queryObject);
		// knex = QueryHelper.loadRequirements(knex, queryObject);
		for (const [key, value] of Object.entries(queryObject)) {
			if (QueryHelper.handlers[key]) {
				knex = QueryHelper.handlers[key]({ db, knex }, value);
			}
		}

		return knex;
	}
}

module.exports = QueryHelper;
