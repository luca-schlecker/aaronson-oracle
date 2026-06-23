{
  description = "Press the 'f' and 'd' keys randomly. It's easy. Just use your \"free will.\"";

  inputs = {
    flake-parts.url = "github:hercules-ci/flake-parts";
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs =
    inputs@{
      flake-parts,
      nixpkgs,
      ...
    }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = nixpkgs.lib.systems.flakeExposed;
      perSystem =
        {
          pkgs,
          ...
        }:
        {
          packages.default = pkgs.buildNpmPackage rec {
            pname = "aaronson-oracle";
            version = "1.0.0";
            src = ./.;
            npmDeps = pkgs.importNpmLock {
              npmRoot = src;
            };
            npmConfigHook = pkgs.importNpmLock.npmConfigHook;
            installPhase = ''
              mkdir -p $out
              mv dist/* $out/
            '';
          };
        };
    };
}
