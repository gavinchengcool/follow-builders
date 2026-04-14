import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const repoRoot = join(process.cwd(), '..');

function read(relativePath) {
  return readFileSync(join(repoRoot, relativePath), 'utf8');
}

test('generate workflow no longer references podcast assets or pod2txt secret', () => {
  const workflow = read('.github/workflows/generate-feed.yml');

  assert.doesNotMatch(workflow, /POD2TXT_API_KEY/);
  assert.doesNotMatch(workflow, /podcasts-only/);
  assert.doesNotMatch(workflow, /feed-podcasts\.json/);
});

test('prepare-digest no longer expects podcast feed or podcast prompt', () => {
  const script = read('scripts/prepare-digest.js');

  assert.doesNotMatch(script, /feed-podcasts\.json/);
  assert.doesNotMatch(script, /summarize-podcast\.md/);
  assert.doesNotMatch(script, /podcastEpisodes/);
  assert.doesNotMatch(script, /podcasts:/);
});

test('generate-feed removes pod2txt integration and rejects legacy podcast-only mode clearly', () => {
  const script = read('scripts/generate-feed.js');

  assert.doesNotMatch(script, /POD2TXT_API_KEY/);
  assert.doesNotMatch(script, /feed-podcasts\.json/);
  assert.doesNotMatch(script, /fetchPodcastContent/);
  assert.match(script, /Podcast support has been removed/);
});
