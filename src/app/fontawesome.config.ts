import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCloudSun, faSun, faCloud, faCloudRain, faBolt, faSearch } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

export function configureFontAwesome(library: FaIconLibrary) {
  library.addIcons(
    faCloudSun,
    faSun,
    faCloud,
    faCloudRain,
    faBolt,
    faSearch,
    faGithub
  );
}
