// CRA'ni eject qilmasdan webpack config'ni o'zgartiramiz.
//
// Muammo: TypeScript type-checker alohida worker process'da ishlaydi. CRA
// ishlatadigan fork-ts-checker v6.5.3 da, ayniqsa eski node 16.7.0 da, bu
// worker'ning xotira limiti ~2GB da qotib qoladi va MUI v7 + styled-components
// turlari og'ir bo'lgani uchun "JavaScript heap out of memory" beradi
// (NODE_OPTIONS ham, memoryLimit ham bu worker'ga ishonchli tegmaydi).
//
// Eslatma: TSC_COMPILE_ON_ERROR=true bo'lganda CRA plagin'ning "Warning"
// variantini ishlatadi (ForkTsCheckerWarningWebpackPlugin), oddiy holatda esa
// ForkTsCheckerWebpackPlugin. Shuning uchun nomi "ForkTsChecker" bilan
// boshlanadigan HAR IKKALA variantni ham olib tashlaymiz.
//
// Bundle baribir kompilyatsiya bo'lib ishlaydi. Type xatolarni quyidagicha
// tekshirasiz:
//   - VS Code: kod yozayotganda jonli ko'rinadi
//   - Terminal: `npm run typecheck`  (tsc --noEmit)
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.plugins = webpackConfig.plugins.filter(
        (plugin) =>
          !(
            plugin &&
            plugin.constructor &&
            plugin.constructor.name &&
            plugin.constructor.name.startsWith('ForkTsChecker')
          )
      );
      return webpackConfig;
    },
  },
};
