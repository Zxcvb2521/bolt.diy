import { useState, useEffect, useMemo, useCallback } from 'react';
import { getFeatureFlags, markFeatureViewed, type Feature } from '~/lib/api/features';

const VIEWED_FEATURES_KEY = 'bolt_viewed_features';

const mergeUniqueFeatureIds = (existing: string[], incoming: string[]) => [...new Set([...existing, ...incoming])];

const isBrowser = () => typeof window !== 'undefined';

const parseFeatureIds = (raw: string | null): string[] => {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((value): value is string => typeof value === 'string');
  } catch {
    return [];
  }
};

const getViewedFeatures = (): string[] => {
  if (!isBrowser()) {
    return [];
  }

  return parseFeatureIds(localStorage.getItem(VIEWED_FEATURES_KEY));
};

const setViewedFeatures = (featureIds: string[]) => {
  if (!isBrowser()) {
    return;
  }

  try {
    localStorage.setItem(VIEWED_FEATURES_KEY, JSON.stringify(featureIds));
  } catch (error) {
    console.error('Failed to persist viewed features:', error);
  }
};

const dedupeFeaturesById = (features: Feature[]): Feature[] => {
  const seen = new Set<string>();

  return features.filter((feature) => {
    if (!feature?.id || seen.has(feature.id)) {
      return false;
    }

    seen.add(feature.id);

    return true;
  });
};

export const useFeatures = () => {
  const [unviewedFeatures, setUnviewedFeatures] = useState<Feature[]>([]);
  const [viewedFeatureIds, setViewedFeatureIds] = useState<string[]>(() => getViewedFeatures());

  const hasNewFeatures = useMemo(() => unviewedFeatures.length > 0, [unviewedFeatures]);

  useEffect(() => {
    let isCancelled = false;

    const checkNewFeatures = async () => {
      try {
        const features = dedupeFeaturesById(await getFeatureFlags());
        const viewedIdSet = new Set(viewedFeatureIds);
        const unviewed = features.filter((feature) => !viewedIdSet.has(feature.id));

        if (!isCancelled) {
          setUnviewedFeatures(unviewed);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('Failed to check for new features:', error);
        }
      }
    };

    checkNewFeatures();

    return () => {
      isCancelled = true;
    };
  }, [viewedFeatureIds]);

  const acknowledgeFeature = useCallback(async (featureId: string) => {
    try {
      await markFeatureViewed(featureId);

      setViewedFeatureIds((prev) => {
        const next = mergeUniqueFeatureIds(prev, [featureId]);
        setViewedFeatures(next);

        return next;
      });
      setUnviewedFeatures((prev) => prev.filter((feature) => feature.id !== featureId));
    } catch (error) {
      console.error('Failed to acknowledge feature:', error);
    }
  }, []);

  const acknowledgeAllFeatures = useCallback(async () => {
    try {
      const featureIds = unviewedFeatures.map((feature) => feature.id);
      await Promise.all(featureIds.map((featureId) => markFeatureViewed(featureId)));

      setViewedFeatureIds((prev) => {
        const next = mergeUniqueFeatureIds(prev, featureIds);
        setViewedFeatures(next);

        return next;
      });
      setUnviewedFeatures([]);
    } catch (error) {
      console.error('Failed to acknowledge all features:', error);
    }
  }, [unviewedFeatures]);

  return { hasNewFeatures, unviewedFeatures, acknowledgeFeature, acknowledgeAllFeatures };
};
