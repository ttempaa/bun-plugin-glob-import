export interface Fixture {
    environment: ("builder" | "runtime")[]
    description: string,
    files: Record<string, string>,
    entrypoint: string,
    assert: (entrypointExports: Record<string, unknown>) => void | Promise<void>;
}